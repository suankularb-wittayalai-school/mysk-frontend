// External libraries
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { db2SubjectListItem } from "@/utils/backend/database";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { ClassWNumber } from "@/utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@/utils/types/common";
import { SubjectListItem, TeacherSubjectItem } from "@/utils/types/subject";
import { Database } from "@/utils/types/supabase";

export async function getRoomsEnrolledInSubject(
  supabase: DatabaseClient,
  subjectID: number
): Promise<BackendDataReturn<ClassWNumber[]>> {
  const { data, error } = await supabase
    .from("room_subjects")
    .select("classroom(id, number)")
    .match({ subject: subjectID });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data.map((roomSubject) => ({
      id: (
        roomSubject.classroom as Database["public"]["Tables"]["classroom"]["Row"]
      ).id,
      number: (
        roomSubject.classroom as Database["public"]["Tables"]["classroom"]["Row"]
      ).number,
    })),
    error: null,
  };
}

export async function getSubjectList(
  supabase: DatabaseClient,
  classID: number
): Promise<{ data: SubjectListItem[]; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("room_subjects")
    .select("*, subject:subject(*), class(*)")
    .match({ class: classID });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: (
      await Promise.all(
        data.map(
          async (roomSubject) => await db2SubjectListItem(supabase, roomSubject)
        )
      )
    ).sort((a, b) => (a.subject.code.th > b.subject.code.th ? 1 : -1)),
    error: null,
  };
}

export async function getTeachSubjectList(
  supabase: DatabaseClient,
  teacherID: number
): Promise<BackendDataReturn<TeacherSubjectItem[]>> {
  const { data, error } = await supabase
    .from("room_subjects")
    .select(
      "subject(id,name_th,name_en,code_th,code_en), teacher, coteacher, \
       class(id,number)"
    )
    .or(`teacher.cs.{"${teacherID}"}, coteacher.cs.{"${teacherID}"}`);

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  const teacherSubjectList: TeacherSubjectItem[] = data
    .map(
      (roomSubject) =>
        (roomSubject.subject as Database["public"]["Tables"]["subject"]["Row"])
          .id
    )
    .filter((id, index, array) => array.indexOf(id) === index)
    .map((subjectID) => {
      const subject = data.find(
        (roomSubject) =>
          subjectID ===
          (
            roomSubject.subject as Database["public"]["Tables"]["subject"]["Row"]
          ).id
      )!.subject as Database["public"]["Tables"]["subject"]["Row"];
      return {
        id: subjectID,
        subject: {
          id: subject.id,
          name: {
            "en-US": { name: subject.name_en },
            th: { name: subject.name_th },
          },
          code: {
            "en-US": subject.code_en,
            th: subject.code_th,
          },
        },
        classes: data
          .filter(
            (roomSubject) =>
              subjectID ===
              (
                roomSubject.subject as Database["public"]["Tables"]["subject"]["Row"]
              ).id
          )
          .map((roomSubject) => ({
            id: (
              roomSubject.class as Database["public"]["Tables"]["classroom"]["Row"]
            ).id,
            number: (
              roomSubject.class as Database["public"]["Tables"]["classroom"]["Row"]
            ).number,
          })),
      };
    });

  return { data: teacherSubjectList, error: null };
}

/**
 * Generate Room Subjects from an array of Teacher Subject Items.
 *
 * @param supabase An Supabase client with proper permissions (either `useSupabaseClient` or `createServerSupabaseClient`).
 * @param teachSubjects An array of subject-class connections for a teacher
 * @param teacherID The Supabase teacher ID of the user (not to be confused with person ID, citizen ID, user ID, Supabase user ID, or legacy teacher ID from the old MySK; those are clearly very different)
 *
 * @returns A standard {@link BackendDataReturn Backend Data Return} of an array of the room subjects generated in the database.
 */
export async function updateRoomSubjectsFromTeachSubjects(
  supabase: DatabaseClient,
  teachSubjects: TeacherSubjectItem[],
  teacherID: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["room_subjects"]["Row"][]>
> {
  // Get exisiting room subjects connected to the same subjects as we’re about
  // to add
  const { data: existing, error: exisitingError } = await supabase
    .from("room_subjects")
    .select("*, subject(id), class(id)")
    .or(
      `subject.in.(${teachSubjects.map(
        (teachSubject) => teachSubject.id
      )}), teacher.cs.{"${teacherID}"}, coteacher.cs.{"${teacherID}"}`
    );

  if (exisitingError) {
    console.error(exisitingError);
    return { data: [], error: exisitingError };
  }

  // (@SiravitPhokeed on 31/01/2023)
  // This code is terrible and I hate it. I just hate working in the backend
  // folder in general. This sucks. No other way to put it. I need to sleep.
  // Maybe forever. Not in the bridge way, more in the lying-on-the-floor way.
  //
  // Thankfully we’ll only have to live with this for...until the end of
  // Semester 1/2023...?

  // (@SiravitPhokeed on 01/04/2023)
  // You know what, let me just get my point out. Nobody will read this anyway.
  // Why on earth is any of this client-side? Why aren’t we just sending the
  // form data to the backend and let the backend do all this computing stuff?
  // Why are we relying on the client to validate and format the data? Isn’t
  // the first rule of web development to never trust the client? What is this?
  // What are we doing??

  const modifiedExisting = existing.map((roomSubject) => {
    const relevantTeachSubject = teachSubjects.find(
      (teachSubject) =>
        // Check for matching subject
        roomSubject.subject.id === teachSubject.id &&
        // Check for matching class
        teachSubject.classes.find(
          (classItem) => classItem.id === roomSubject.class.id
        )
    );

    return {
      ...roomSubject,

      // Modify the teachers list to reflect the client-side subject list
      teacher:
        // If the client-side subject list includes this room subject
        relevantTeachSubject && !relevantTeachSubject.isCoteacher
          ? // If the user is already in this room subject, leave it as is
            roomSubject.teacher.includes(teacherID)
            ? roomSubject.teacher
            : // Otherwise, add the teacher to the room subject
              [...roomSubject.teacher, teacherID]
          : // If the client-side subject list does NOT include this room
            // subject, that means the teacher is no longer in this room
            // subject, so the teacher is removed
            roomSubject.teacher.filter((teacher) => teacherID !== teacher),

      // The same for the coteachers list
      coteacher:
        relevantTeachSubject && relevantTeachSubject.isCoteacher
          ? roomSubject.coteacher?.includes(teacherID)
            ? roomSubject.coteacher
            : [...(roomSubject.coteacher || []), teacherID]
          : roomSubject.coteacher?.filter((teacher) => teacherID !== teacher),
    };
  });

  // Remove classes already represented by an existing room subject from the
  // client-side list
  const teachSubjectsWithoutExisting = teachSubjects.map((teachSubject) => {
    const relevantExisting = modifiedExisting.filter(
      (roomSubject) => teachSubject.id === roomSubject.subject.id
    );
    return {
      ...teachSubject,
      classes: relevantExisting.length
        ? teachSubject.classes.filter((classItem) =>
            relevantExisting.find(
              (roomSubject) => classItem.id !== roomSubject.class.id
            )
          )
        : teachSubject.classes,
    };
  });

  // (@SiravitPhokeed)
  // I’d love use `upsert` to combine these 2 database calls here, but since
  // Supabase doesn’t generate IDs for new rows during an upsert, I can’t.
  //
  // I also can’t do this anymore. This function will be called literally once
  // a year for a user. Why am I putting effort into this.

  // Update existing room subjects
  const { data: updatedRows, error: updateError } = await supabase
    .from("room_subjects")
    .upsert(
      modifiedExisting.map((roomSubject) => ({
        id: roomSubject.id,
        subject: roomSubject.subject.id,
        teacher: roomSubject.teacher,
        coteacher: roomSubject.coteacher,
        class: roomSubject.class.id,
      }))
    )
    .select();

  if (updateError) {
    console.error(updateError);
    return { data: [], error: updateError };
  }

  // Insert new room subjects
  const { data: newRows, error: newError } = await supabase
    .from("room_subjects")
    .insert(
      teachSubjectsWithoutExisting
        .map((teachSubject) =>
          teachSubject.classes.map((classItem) => ({
            subject: teachSubject.id,
            teacher: !teachSubject.isCoteacher ? [teacherID] : [],
            coteacher: teachSubject.isCoteacher ? [teacherID] : [],
            class: classItem.id,
          }))
        )
        .flat()
    )
    .select();

  if (newError) {
    console.error(newError);
    return { data: [], error: newError };
  }

  return { data: updatedRows!.concat(newRows!), error: null };
}
