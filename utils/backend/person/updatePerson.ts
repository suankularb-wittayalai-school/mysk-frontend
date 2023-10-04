import logError from "@/utils/helpers/logError";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { ShirtSize, Student, Teacher } from "@/utils/types/person";
import createContact from "../contact/createContact";
import addContactToPerson from "../contact/addContactToPerson";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";

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
    contacts?: Contact[];
  },
  person: Student | Teacher,
): Promise<BackendReturn<string>> {
  if (form.contacts) {
    // Delete existing contacts
    for (let contact of person.contacts) {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", contact.id);
      if (error) {
        logError("updatePerson (delete existing Contacts)", error);
        return { data: null, error };
      }
    }

    // Create contacts
    await Promise.all(
      form.contacts.map(async (contact) => {
        const { data: createdContactID, error: createContactError } =
          await createContact(supabase, contact);
        if (createContactError) {
          logError("updatePerson (create Contacts)", createContactError);
          return;
        }

        const { error } = await addContactToPerson(
          supabase,
          person,
          createdContactID,
        );

        if (error) {
          logError("updatePerson (add Contacts to Person)", error);
          return;
        }

        return createdContactID!;
      }),
    );
  }

  let personID: string | null = null;

  if (person.role === "student") {
    const { data, error } = await supabase
      .from("students")
      .select("person_id")
      .eq("id", person.id)
      .single();

    if (error) {
      logError("updatePerson (student)", error);
    }

    personID = data!.person_id;
  } else if (person.role === "teacher") {
    const { data, error } = await supabase
      .from("teachers")
      .select("person_id")
      .eq("id", person.id)
      .single();

    if (error) {
      logError("updatePerson (teacher)", error);
    }

    personID = data!.person_id;
  }

  if (!personID) {
    logError("addContactToPerson", { message: "No person ID found" });
    return { error: { message: "No person ID found" }, data: null };
  }

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
        person_id: personID!,
        allergy_name: allergy,
      })),
    );

  if (allergiesAddError) {
    logError("updatePerson (allergies addition)", allergiesAddError);
    return { data: null, error: allergiesAddError };
  }

  // Update person data (`person` table)
  const { data: updatedPerson, error: personError } = await supabase
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
    .match({ id: personID })
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

  return { error: null, data: personID };
}
