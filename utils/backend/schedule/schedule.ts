// Backend
import { getClassIDFromNumber } from "@/utils/backend/classroom/classroom";
import { isOverlappingExistingItems } from "@/utils/backend/schedule/utils";

// Converters
import { db2SchedulePeriod, db2Teacher } from "@/utils/backend/database";

// Helpers
import { range } from "@/utils/helpers/array";
import {
  getCurrentAcademicYear,
  getCurrentSemester,
} from "@/utils/helpers/date";
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@/utils/helpers/schedule";

// Types
import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
} from "@/utils/types/common";
import { Role, Teacher } from "@/utils/types/person";
import { PeriodContentItem, Schedule } from "@/utils/types/schedule";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective
 * @param role The role of the user getting Schedule
 * @param classID The Supabase ID of the class the user is a part of
 */
export async function getSchedule(
  supabase: DatabaseClient,
  role: "student",
  classID: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>>;

/**
 * Construct a Teaching Schedule from Schedule Items from the teacher’s perspective
 * @param role The role of the user getting Schedule
 * @param teacherID The Supabase ID of the user (who should be a Teacher)
 */
export async function getSchedule(
  supabase: DatabaseClient,
  role: "teacher",
  teacherID: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>>;

export async function getSchedule(
  supabase: DatabaseClient,
  role: Role,
  id: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>> {
  // Schedule filled with empty periods
  let schedule =
    day === undefined ? createEmptySchedule(1, 5) : createEmptySchedule(day);

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("schedule_items")
    .select(
      "*, subject(*), teacher(*, person(*), subject_group(*)), classroom(id, number)"
    )
    .match({
      ...(role === "teacher"
        ? // Match teacher if role is teacher
          day === undefined
          ? { teacher: id }
          : { teacher: id, day }
        : // Match classroom if role is student
        day === undefined
        ? { classroom: id }
        : { classroom: id, day }),
      year: getCurrentAcademicYear(),
      semester: getCurrentSemester(),
    });

  // Return an empty Schedule if fetch failed
  if (error) {
    console.error(error);
    return { data: schedule, error };
  }

  let teacherIDs: number[] = [];
  for (let scheduleItem of data!)
    teacherIDs = [
      ...teacherIDs,
      scheduleItem.teacher.id,
      ...(scheduleItem.coteachers || []),
    ];

  // Fetch teacher data seperately
  const { data: teachersData, error: teachersError } = await supabase
    .from("teacher")
    .select("*, person(*), subject_group(*)")
    .or(`id.in.(${teacherIDs})`);

  // Return an empty Schedule if fetch failed
  if (teachersError) {
    console.error(teachersError);
    return { data: schedule, error: teachersError };
  }

  // Format teachers data
  const teachers: Teacher[] = await Promise.all(
    teachersData.map(async (teacher) => await db2Teacher(supabase, teacher))
  );

  // Add Supabase data to empty schedule
  for (let incomingPeriod of data!) {
    // Find the index of the row (day) we want to manipulate
    const scheduleRowIndex = schedule.content.findIndex(
      (scheduleRow) => incomingPeriod.day === scheduleRow.day
    );

    // Loop through each existing period in this row
    const periodIndices = range(
      schedule.content[scheduleRowIndex].content.length
    );
    for (let idx of periodIndices) {
      // The current period that exists in the Schedule
      const schedulePeriod = schedule.content[scheduleRowIndex].content[idx];

      // If there is no period at this index, skip it
      if (!schedulePeriod) continue;

      // Ignore other periods (keep as is)
      if (
        !arePeriodsOverlapping(
          {
            startTime: schedulePeriod.startTime,
            duration: schedulePeriod.duration,
          },
          {
            startTime: incomingPeriod.start_time,
            duration: incomingPeriod.duration,
          }
        )
      )
        continue;

      // Determine what to do if the incoming period overlaps with an existing
      // period
      let processedPeriod = await db2SchedulePeriod(
        supabase,
        incomingPeriod,
        role
      );

      // Add teacher and coteacher data to the subject
      processedPeriod.content[0].subject = {
        ...processedPeriod.content[0].subject,
        teachers: [
          teachers.find((teacher) => incomingPeriod.teacher.id === teacher.id)!,
        ],
        coTeachers: incomingPeriod.coteachers
          ? incomingPeriod.coteachers.map(
              (coTeacher) =>
                teachers.find((teacher) => coTeacher === teacher.id)!
            )
          : [],
      };

      // Replace empty period
      if (schedulePeriod.content.length === 0) {
        schedule.content[scheduleRowIndex].content[idx] = processedPeriod;
        // Remove empty periods that is now overlapping the new incoming period
        schedule.content[scheduleRowIndex].content.splice(
          idx + 1,
          incomingPeriod.duration - 1
        );
        continue;
      }

      // After this point, we’re dealing with combining many overlapping
      // subjects into 1 period, or an Elective Period, to put simply. This
      // does not apply to teachers as a teacher cannot be teaching 2 classes
      // at once, so we can just ignore it.
      if (role === "teacher") continue;

      // If a period already exists here, just adjust duration and modify the
      // `subjects` array
      if (schedulePeriod.duration < incomingPeriod.duration)
        schedulePeriod.duration = incomingPeriod.duration;
      schedulePeriod.content = schedulePeriod.content.concat(
        processedPeriod.content
      );

      schedule.content[scheduleRowIndex].content[idx] = schedulePeriod;
    }
  }

  // Sort the periods
  schedule.content = schedule.content.map((scheduleRow) => ({
    ...scheduleRow,
    content: scheduleRow.content.sort((a, b) => a.startTime - b.startTime),
  }));

  return { data: schedule, error: null };
}

export async function getSchedulesOfGrade(
  supabase: DatabaseClient,
  grade: number
): Promise<BackendDataReturn<Schedule[]>> {
  const { data: classes, error: classesError } = await supabase
    .from("classroom")
    .select("id, number")
    .lt("number", (grade + 1) * 100)
    .gt("number", grade * 100)
    .order("number");

  if (classesError) {
    console.error(classesError);
    return { data: [], error: classesError };
  }

  return {
    data: await Promise.all(
      classes!.map(async (classItem) => ({
        ...(await getSchedule(supabase, "student", classItem.id)).data,
        class: classItem,
      }))
    ),
    error: null,
  };
}

/**
 * Insert a Schedule Item
 * @param form Edit Period dialog form
 * @param teacherID The Supabase ID of the Teacher teaching this Schedule Period
 */
export async function createScheduleItem(
  supabase: DatabaseClient,
  form: {
    subject: number;
    class: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  teacherID: number
): Promise<BackendReturn> {
  // Check overlap
  if (
    await isOverlappingExistingItems(
      form.day as Day,
      { startTime: form.startTime, duration: form.duration },
      teacherID
    )
  )
    return {
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods.",
      },
    };

  const { data: classID, error: classError } = await getClassIDFromNumber(
    supabase,
    form.class
  );

  if (classError) {
    console.error(classError);
    return { error: classError };
  }

  const { error } = await supabase.from("schedule_items").insert({
    subject: form.subject,
    classroom: classID,
    room: form.room,
    teacher: teacherID,
    day: form.day,
    start_time: form.startTime,
    duration: form.duration,
    year: getCurrentAcademicYear(),
    semester: getCurrentSemester(),
  });

  if (error) console.error(error);

  return { error };
}

export async function editScheduleItem(
  supabase: DatabaseClient,
  form: {
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  id: number
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("schedule_items")
    .update({
      subject: form.subject,
      classroom: form.classID,
      room: form.room,
      day: form.day,
      start_time: form.startTime,
      duration: form.duration,
    })
    .match({ id });

  if (error) console.error(error);

  return { error };
}

export async function moveScheduleItem(
  supabase: DatabaseClient,
  day: Day,
  schedulePeriod: PeriodContentItem,
  teacherID: number
): Promise<BackendReturn> {
  // Cap start time
  schedulePeriod.startTime = Math.min(
    // A period must not exceed the left edge of the Schedule
    Math.max(schedulePeriod.startTime, 1),
    // A period must not exceed the right edge of the Schedule
    10 - schedulePeriod.duration + 1
  );

  // Check overlap
  if (await isOverlappingExistingItems(day, schedulePeriod, teacherID))
    return {
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods.",
      },
    };

  const { error } = await supabase
    .from("schedule_items")
    .update({ day: day, start_time: schedulePeriod.startTime })
    .match({ id: schedulePeriod.id });

  if (error) console.error(error);

  return { error };
}

export async function editScheduleItemDuration(
  supabase: DatabaseClient,
  day: Day,
  schedulePeriod: PeriodContentItem,
  teacherID: number
): Promise<BackendReturn> {
  // Cap duration
  schedulePeriod.duration = Math.min(
    // A period must be at least 1 duration long
    Math.max(schedulePeriod.duration, 1),
    // A period must not exceed the right edge of the Schedule
    10 - schedulePeriod.startTime + 1
  );

  // A period must not overlap other relevant periods
  if (await isOverlappingExistingItems(day, schedulePeriod, teacherID))
    return {
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods",
      },
    };

  // Save the change
  const { error } = await supabase
    .from("schedule_items")
    .update({ duration: schedulePeriod.duration })
    .match({ id: schedulePeriod.id });

  if (error) console.error(error);

  return { error };
}

export async function deleteScheduleItem(
  supabase: DatabaseClient,
  id: number
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("schedule_items")
    .delete()
    .match({ id });

  if (error) console.error(error);

  return { error };
}
