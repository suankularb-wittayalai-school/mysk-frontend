import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { PersonDB } from "@utils/types/database/person";
import { Person } from "@utils/types/person";

const prefixMap = {
    Master: "เด็กชาย",
    "Mr.": "นาย",
    "Mrs.": "นาง",
    "Miss.": "นางสาว",
};

export async function createPerson(person: Person): Promise<{ data: PersonDB[] | null; error: PostgrestError | null }> {
    const { data: createdPerson, error: personCreationError } = await supabase
        .from<PersonDB>("people")
        .insert({
            prefix_th: prefixMap[person.prefix as keyof typeof prefixMap] as
                | "นาย"
                | "นาง"
                | "นางสาว"
                | "เด็กชาย",
            prefix_en: person.prefix as "Mr." | "Mrs." | "Miss." | "Master",
            first_name_th: person.name.th.firstName,
            middle_name_th: person.name.th.middleName,
            last_name_th: person.name.th.lastName,
            first_name_en: person.name["en-US"]?.firstName,
            middle_name_en: person.name["en-US"]?.middleName,
            last_name_en: person.name["en-US"]?.lastName,
            birthdate: person.birthdate,
            citizen_id: person.citizen_id,
        });
    if (personCreationError || !person) {
        console.error(personCreationError);
        return { data: null, error: personCreationError };
    }
    return { data: createdPerson, error: null };
}