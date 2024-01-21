import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ShirtSize, Student, Teacher, UserRole } from "@/utils/types/person";

/**
 * Updates a Person's data.
 *
 * @param supabase The Supabase client.
 * @param form The form data.
 * @param person The Person to update.
 */
export async function updatePerson(
  supabase: DatabaseClient,
  form: {
    prefixTH: string;
    firstNameTH: string;
    middleNameTH: string;
    lastNameTH: string;
    nicknameTH: string;
    prefixEN: string;
    firstNameEN: string;
    middleNameEN: string;
    lastNameEN: string;
    nicknameEN: string;
    subjectGroup: number;
    classAdvisorAt: string;
    birthdate: string;
    allergies: string[];
    shirtSize: ShirtSize;
    pantsSize: string;
  },
  person: Student | Teacher,
): Promise<BackendReturn> {
  const { data: fetchedPerson, error: personIDError } = await supabase
    .from(person.role === UserRole.teacher ? "teachers" : "students")
    .select("person_id")
    .eq("id", person.id)
    .single();
  const personID = fetchedPerson!.person_id;

  if (personIDError) return { data: null, error: personIDError };

  // Update allergies data
  const { error: allergiesRemoveError } = await supabase
    .from("person_allergies")
    .delete()
    .eq("person_id", personID);

  if (allergiesRemoveError) {
    logError("updatePerson (allergies removal)", allergiesRemoveError);
    return { data: null, error: allergiesRemoveError };
  }

  const { error: allergiesAddError } = await supabase
    .from("person_allergies")
    .insert(
      form.allergies.map((allergy) => ({
        person_id: personID,
        allergy_name: allergy,
      })),
    );

  if (allergiesAddError) {
    logError("updatePerson (allergies addition)", allergiesAddError);
    return { data: null, error: allergiesAddError };
  }

  // Update person data (`person` table)
  const { error: personError } = await supabase
    .from("people")
    .update({
      prefix_th: form.prefixTH,
      first_name_th: form.firstNameTH,
      middle_name_th: form.middleNameTH,
      last_name_th: form.lastNameTH,
      nickname_th: form.nicknameTH,
      prefix_en: form.prefixEN,
      first_name_en: form.firstNameEN,
      middle_name_en: form.middleNameEN,
      last_name_en: form.lastNameEN,
      nickname_en: form.nicknameEN,
      birthdate: form.birthdate,
      shirt_size: form.shirtSize,
      pants_size: form.pantsSize,
    })
    .eq("id", personID)
    .select("*")
    .order("id")
    .limit(1)
    .single();

  if (personError) {
    logError("updatePerson (update Person)", personError);
    return { data: null, error: personError };
  }

  if (person.role === "teacher") {
    const { error } = await supabase
      .from("teachers")
      .update({ subject_group_id: form.subjectGroup })
      .match({ id: person.id });

    if (error) {
      logError("updatePerson (update Teacher)", error);
      return { data: null, error };
    }

    // Remove the teacher from the classroom the teacher was an advisor of
    if (
      // If the teacher is already an advisor
      person.class_advisor_at &&
      // If Class Advisor At field is empty or was changed
      (!form.classAdvisorAt ||
        form.classAdvisorAt !== String(person.class_advisor_at.number))
    ) {
      const { error: classroomError } = await supabase
        .from("classroom_advisors")
        .delete()
        .eq("teacher_id", person.id)
        .eq("classroom_id", person.class_advisor_at.id);

      if (classroomError) {
        logError(
          "updatePerson (remove advisor from classroom)",
          classroomError,
        );
        return { data: null, error: classroomError };
      }
    }

    if (form.classAdvisorAt) {
      const { data: newClassroom, error: newClassroomError } = await supabase
        .from("classrooms")
        .select("id")
        .match({
          number: form.classAdvisorAt,
          year: getCurrentAcademicYear(),
        })
        .maybeSingle();

      if (newClassroomError) {
        logError("updatePerson (get new classroom)", newClassroomError);
        return { data: null, error: newClassroomError };
      }

      const { error: newClassroomAdvisorError } = await supabase
        .from("classroom_advisors")
        .upsert({
          teacher_id: person.id,
          classroom_id: newClassroom!.id,
        })
        .eq("teacher_id", person.id)
        .eq("classroom_id", newClassroom!.id);

      if (newClassroomAdvisorError) {
        logError(
          "updatePerson (add advisor to classroom)",
          newClassroomAdvisorError,
        );
        return { data: null, error: newClassroomAdvisorError };
      }
    }
  }

  return { data: null, error: null };
}
