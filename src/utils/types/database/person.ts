import { ContactDB } from './contact';
import { SubjectGroupDB } from './subject';

export interface PersonDB {
    id: number;
    created_at: string;
    prefix_en: "Master" | "Mr." | "Mrs." | "Miss.";
    prefix_th: "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
    first_name_th: string;
    last_name_th: string;
    middle_name_th?: string;
    first_name_en?: string;
    last_name_en?: string;
    middle_name_en?: string;
    birthdate: string;
    citizen_id: string;
    profile?: string;
    contacts: ContactDB[];
}

export interface StudentDB {
    id: number;
    created_at: string;
    std_id: string;
    people: PersonDB;
}

export interface TeacherDB {
    id: number;
    created_at: string;
    people: PersonDB;
    teacher_id: string;
    SubjectGroup: SubjectGroupDB;
}