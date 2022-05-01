import { StudentDB } from "@utils/types/database/person";
import { Student } from "@utils/types/person";


export function db2student(student: StudentDB): Student {
    return {
        id: student.id,
        prefix: student.people.prefix_en,
        role: "student",
        name: {
            th: {
                firstName: student.people.first_name_th,
                lastName: student.people.last_name_th,
            },
            "en-US": {
                firstName: student.people.first_name_en ? student.people.first_name_en : "",
                lastName: student.people.last_name_en ? student.people.last_name_en : "",
            },
        },
        studentID: student.std_id,

        // TODO: Get class
        class: {
            id: 101,
            name: {
                "en-US": "M.101",
                th: "ม.101",
            },
        },
        citizen_id: student.people.citizen_id,
        birthdate: student.people.birthdate,

        // TODO: Get classNo
        classNo: 1,

        // TODO: Get contacts
        contacts: [],
    }
}