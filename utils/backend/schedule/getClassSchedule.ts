// Imports
import {
  getCurrentAcademicYear,
  getCurrentSemester,
} from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { createEmptySchedule } from "@/utils/helpers/schedule";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Schedule, PeriodContentItem } from "@/utils/types/schedule";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective.
 *
 * @param classroomID The Supabase ID of the class the user is a part of.
 */
export default async function getClassSchedule(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<BackendReturn<Schedule>> {
  // Schedule filled with empty periods
  let schedule = createEmptySchedule(1, 5);

  const { data: scheduleItems, error: scheduleItemsError } = await supabase
    .from("schedule_items")
    .select(
      `id,
      day,
      start_time,
      duration,
      subjects!inner(id, name_en, name_th, code_th, code_en),
      schedule_item_classrooms!inner(classrooms(id, number)),
      schedule_item_teachers!inner(teachers(id, people(first_name_en, last_name_en, first_name_th, last_name_th))),
      schedule_item_rooms!inner(room)
    `,
    )
    .eq("schedule_item_classrooms.classroom_id", classroomID);
  // .match({
  //   "schedule_item_classroom_subjects.classroom_subjects.classroom_id":
  //     classroomID,
  //   year: getCurrentAcademicYear(),
  //   semester: getCurrentSemester(),
  // });
  if (scheduleItemsError) {
    logError("getClassSchedule (scheduleItems)", scheduleItemsError);
    return { data: null, error: scheduleItemsError };
  }

 

  let periodsItems: (PeriodContentItem | undefined)[]  = scheduleItems!.map((scheduleItem) => {
    if (!scheduleItem.subjects) {
      return;
    }

    return {
      id: scheduleItem.id,
      day: scheduleItem.day,
      start_time: scheduleItem.start_time,
      duration: scheduleItem.duration,
      subject: {
        id: scheduleItem.subjects.id,
        name: {
          th: scheduleItem.subjects.name_th,
          "en-US": scheduleItem.subjects.name_en,
        },
        code: {
          th: scheduleItem.subjects.code_th,
          "en-US": scheduleItem.subjects.code_en,
        },
      },
      teachers: scheduleItem.schedule_item_teachers.map((teacher) => ({
        id: teacher.teachers!.id,
        first_name: {
          th: teacher.teachers!.people!.first_name_th,
          "en-US": teacher.teachers!.people!.first_name_en,
        },
        last_name: {
          th: teacher.teachers!.people!.last_name_th,
          "en-US": teacher.teachers!.people!.last_name_en,
        },
      })),
      rooms: scheduleItem.schedule_item_rooms.map((room) => room.room),
    };
  });

  // // 🍌🍌🍌

  console.log(periodsItems);

  // let uniqueScheduleItemsID = Array.from(new Set(
  //   scheduleItems!.map((scheduleItem) => scheduleItem.id),
  // ));

  // get all the teachers for the schedule items
  // const { data: scheduleItemTeachers, error: scheduleItemTeachersError } =
  //   await supabase
  //     .from("schedule_item_teachers")
  //     .select(
  //       `schedule_item_id,
  //       teachers(id, first_name_en, last_name_en, first_name_th, last_name_th)
  //     `,
  //     )
  //     .in("schedule_item_id",uniqueScheduleItemsID);
  // if (scheduleItemTeachersError) {
  //   logError("getClassSchedule (scheduleItemTeachers)", scheduleItemTeachersError);
  //   return { data: null, error: scheduleItemTeachersError };
  // }

  // // get all co teachers for the schedule items
  // const { data: scheduleItemCoTeachers, error: scheduleItemCoTeachersError } =
  //   await supabase
  //     .from("schedule_item_co_teachers")
  //     .select(
  //       `schedule_item_id,
  //       teachers(id, first_name_en, last_name_en, first_name_th, last_name_th)
  //     `,
  //     )
  //     .in("schedule_item_id",uniqueScheduleItemsID);
  // if (scheduleItemCoTeachersError) {
  //   logError("getClassSchedule (scheduleItemCoTeachers)", scheduleItemCoTeachersError);
  //   return { data: null, error: scheduleItemCoTeachersError };
  // }

  // // get all rooms for the schedule items
  // const { data: scheduleItemRooms, error: scheduleItemRoomsError } =
  //   await supabase
  //     .from("schedule_item_rooms")
  //     .select(
  //       `schedule_item_id,
  //       rooms(id, name_en, name_th)
  //     `,
  //     )
  //     .in("schedule_item_id",uniqueScheduleItemsID);
  // if (scheduleItemRoomsError) {
  //   logError("getClassSchedule (scheduleItemRooms)", scheduleItemRoomsError);
  //   return { data: null, error: scheduleItemRoomsError };
  // }

  // merge all the teachers, co teachers and rooms into the schedule items by group by schedule item id
  // scheduleItems!.forEach((scheduleItem) => {
  //   scheduleItem.teacher = scheduleItemTeachers!.filter((scheduleItemTeacher) => scheduleItemTeacher.schedule_item_id === scheduleItem.id).map((scheduleItemTeacher) => scheduleItemTeacher.teachers);
  //   scheduleItem.co_teachers = scheduleItemCoTeachers!.filter((scheduleItemCoTeacher) => scheduleItemCoTeacher.schedule_item_id === scheduleItem.id).map((scheduleItemCoTeacher) => scheduleItemCoTeacher.teachers);
  //   scheduleItem.rooms = scheduleItemRooms!.filter((scheduleItemRoom) => scheduleItemRoom.schedule_item_id === scheduleItem.id).map((scheduleItemRoom) => scheduleItemRoom.rooms);
  // });

  // const {
  //   data: scheduleItemClassroomSubjects,
  //   error: scheduleItemClassroomSubjectsError,
  // } = await supabase
  //   .from("schedule_item_classroom_subjects")
  //   .select("schedule_item_id")
  //   .contains(
  //     "classroom_subject_id",
  //     classroomSubjects!.map((classroomSubject) => classroomSubject.id),
  //   );
  // if (scheduleItemClassroomSubjectsError) {
  //   logError(
  //     "getClassSchedule (scheduleItemClassroomSubjects)",
  //     scheduleItemClassroomSubjectsError,
  //   );
  //   return { data: null, error: scheduleItemClassroomSubjectsError };
  // }

  return { data: schedule, error: null };
}
