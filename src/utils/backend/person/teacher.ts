import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { PersonDB, TeacherTable } from "@utils/types/database/person";
import { Teacher } from "@utils/types/person";
import { createPerson } from "./person";

export async function createTeacher(teacher: Teacher, email: string): Promise<{ data: TeacherTable[] | null; error: PostgrestError | null }> {
    const { data: person, error: personCreationError } = await createPerson(teacher);
    if (personCreationError || !person) {
        console.error(personCreationError);
        return { data: null, error: personCreationError };
    }
    const {
        data: createdTeacher,
        error: teacherCreationError,
    } = await supabase.from<TeacherTable>("teacher").insert({
        person: person[0]?.id,
        subject_group: teacher.subject_group.id,
        // class_advisor_at: form.classAdvisorAt,
        teacher_id: teacher.teacherID.trim(),
    });
    if (teacherCreationError || !teacher) {
        console.error(teacherCreationError);
        // delete the created person
        await supabase
            .from<PersonDB>("people")
            .delete()
            .match({ id: person[0]?.id });
        return { data: null, error: teacherCreationError };
    }

    // register an account for the teacher
    await supabase.auth.signUp(
        {
            email: email,
            password: teacher.birthdate.split("-").join(""),
        },
        {
            data: {
                teacher: createdTeacher[0]?.id,
                role: "teacher",
            },
        }
    );
    return { data: createdTeacher, error: null };
}