import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { Class } from "@utils/types/class";
import { ClassroomTable } from "@utils/types/database/class";
import { ScheduleTable } from "@utils/types/database/schedule";
import { createContact } from "../contact";

export async function createClassroom(
  classroom: Class
): Promise<{ data: ClassroomTable[] | null; error: PostgrestError | null }> {
  const contacts = await Promise.all(
    classroom.contacts.map(async (contact) => await createContact(contact))
  );

  // check if any contact creation failed
  if (contacts.some((contact) => contact.error)) {
    const error = contacts.find((contact) => contact.error)?.error;
    if (error) {
      console.error(error);
      return { data: null, error };
    } else {
      throw new Error("Unknown error");
    }
  }

  const { data: schedule, error: scheduleError } = await supabase
    .from<ScheduleTable>("Schedule")
    .insert({
      schedule_rows: [],
      year: classroom.year,
      semester: classroom.semester,
    });

  if (scheduleError || !schedule) {
    console.error(scheduleError);
    return { data: null, error: scheduleError };
  }

  // map the created contact to id
  const contactIds = contacts
    .map((contact) => contact.data?.[0]?.id)
    .filter((id) => id !== undefined || id !== null);

  const { data: createdClass, error: classCreationError } = await supabase
    .from<ClassroomTable>("classroom")
    .insert({
      number: classroom.name.th.split(" ")[1],
      year: classroom.year,
      contacts: contactIds as number[],
      semester: classroom.semester,
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      schedule: schedule[0].id,
      subjects: [],
    });
  if (classCreationError || !createdClass) {
    console.error(classCreationError);
    return { data: null, error: classCreationError };
  }
  return { data: createdClass, error: null };
}
