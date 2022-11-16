export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      classroom: {
        Row: {
          id: number;
          created_at: string | null;
          number: number;
          year: number;
          students: number[];
          advisors: number[];
          contacts: number[];
          subjects: number[];
          no_list: number[];
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          number: number;
          year: number;
          students: number[];
          advisors: number[];
          contacts: number[];
          subjects: number[];
          no_list?: number[];
        };
        Update: {
          id?: number;
          created_at?: string | null;
          number?: number;
          year?: number;
          students?: number[];
          advisors?: number[];
          contacts?: number[];
          subjects?: number[];
          no_list?: number[];
        };
      };
      contact: {
        Row: {
          id: number;
          created_at: string | null;
          name_th: string;
          type: Database["public"]["Enums"]["contact_type"];
          value: string;
          name_en: string | null;
          include_students: boolean | null;
          include_teachers: boolean | null;
          include_parents: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name_th: string;
          type: Database["public"]["Enums"]["contact_type"];
          value: string;
          name_en?: string | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          include_parents?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name_th?: string;
          type?: Database["public"]["Enums"]["contact_type"];
          value?: string;
          name_en?: string | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          include_parents?: boolean | null;
        };
      };
      form_field_value: {
        Row: {
          id: number;
          created_at: string | null;
          field: number;
          value: string;
          submission: number;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          field: number;
          value?: string;
          submission: number;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          field?: number;
          value?: string;
          submission?: number;
        };
      };
      form_questions: {
        Row: {
          id: number;
          created_at: string | null;
          form: number;
          label_th: string;
          type: Database["public"]["Enums"]["form_type_enum"];
          options: string[] | null;
          range_start: number | null;
          range_end: number | null;
          label_en: string | null;
          required: boolean;
          default: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          form: number;
          label_th?: string;
          type?: Database["public"]["Enums"]["form_type_enum"];
          options?: string[] | null;
          range_start?: number | null;
          range_end?: number | null;
          label_en?: string | null;
          required?: boolean;
          default?: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          form?: number;
          label_th?: string;
          type?: Database["public"]["Enums"]["form_type_enum"];
          options?: string[] | null;
          range_start?: number | null;
          range_end?: number | null;
          label_en?: string | null;
          required?: boolean;
          default?: string;
        };
      };
      form_submissions: {
        Row: {
          id: number;
          created_at: string | null;
          form: number;
          person: Database["public"]["Tables"]["people"]["Row"] | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          form: number;
          person?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          form?: number;
          person?: number | null;
        };
      };
      forms: {
        Row: {
          id: number;
          created_at: string;
          due_date: string | null;
          students_done: number[] | null;
          frequency: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent: Database["public"]["Tables"]["news"]["Row"];
        };
        Insert: {
          id?: number;
          created_at?: string;
          due_date?: string | null;
          students_done?: number[] | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          due_date?: string | null;
          students_done?: number[] | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent?: number;
        };
      };
      infos: {
        Row: {
          id: number;
          created_at: string;
          body_th: string;
          body_en: string;
          parent: Database["public"]["Tables"]["news"]["Row"];
        };
        Insert: {
          id?: number;
          created_at?: string;
          body_th: string;
          body_en: string;
          parent: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          body_th?: string;
          body_en?: string;
          parent?: number;
        };
      };
      news: {
        Row: {
          id: number;
          created_at: string;
          title_th: string;
          title_en: string | null;
          description_th: string;
          description_en: string | null;
          image: string | null;
          old_url: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title_th?: string;
          title_en?: string | null;
          description_th?: string;
          description_en?: string | null;
          image?: string | null;
          old_url?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          title_th?: string;
          title_en?: string | null;
          description_th?: string;
          description_en?: string | null;
          image?: string | null;
          old_url?: string | null;
        };
      };
      payments: {
        Row: {
          id: number;
          created_at: string;
          due_date: string | null;
          students_done: number[] | null;
          amount_owed: number | null;
          frequency: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent: Database["public"]["Tables"]["news"]["Row"];
        };
        Insert: {
          id?: number;
          created_at?: string;
          due_date?: string | null;
          students_done?: number[] | null;
          amount_owed?: number | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          due_date?: string | null;
          students_done?: number[] | null;
          amount_owed?: number | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          parent?: number;
        };
      };
      people: {
        Row: {
          id: number;
          created_at: string | null;
          prefix_th: string;
          prefix_en: string | null;
          first_name_th: string;
          first_name_en: string | null;
          last_name_th: string;
          last_name_en: string | null;
          middle_name_th: string | null;
          middle_name_en: string | null;
          birthdate: string;
          citizen_id: string;
          contacts: number[] | null;
          profile: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          prefix_th: string;
          prefix_en?: string | null;
          first_name_th: string;
          first_name_en?: string | null;
          last_name_th: string;
          last_name_en?: string | null;
          middle_name_th?: string | null;
          middle_name_en?: string | null;
          birthdate: string;
          citizen_id: string;
          contacts?: number[] | null;
          profile?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          prefix_th?: string;
          prefix_en?: string | null;
          first_name_th?: string;
          first_name_en?: string | null;
          last_name_th?: string;
          last_name_en?: string | null;
          middle_name_th?: string | null;
          middle_name_en?: string | null;
          birthdate?: string;
          citizen_id?: string;
          contacts?: number[] | null;
          profile?: string | null;
        };
      };
      room_subjects: {
        Row: {
          id: number;
          created_at: string | null;
          subject: Database["public"]["Tables"]["subject"]["Row"];
          ggc_code: string | null;
          ggc_link: string | null;
          gg_meet_link: string | null;
          teacher: number[];
          coteacher: number[] | null;
          class: Pick<
            Database["public"]["Tables"]["classroom"]["Row"],
            "id" | "number"
          >;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          subject: number;
          ggc_code?: string | null;
          ggc_link?: string | null;
          gg_meet_link?: string | null;
          teacher: number[];
          coteacher?: number[] | null;
          class: number;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          subject?: number;
          ggc_code?: string | null;
          ggc_link?: string | null;
          gg_meet_link?: string | null;
          teacher?: number[];
          coteacher?: number[] | null;
          class?: number;
        };
      };
      schedule_items: {
        Row: {
          id: number;
          created_at: string | null;
          subject: Database["public"]["Tables"]["subject"]["Row"];
          teacher: Database["public"]["Tables"]["teacher"]["Row"];
          coteachers: number[] | null;
          day: number | null;
          start_time: number;
          duration: number;
          room: string;
          classroom: Pick<
            Database["public"]["Tables"]["classroom"]["Row"],
            "id" | "number"
          >;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          subject?: number;
          teacher: number;
          coteachers?: number[] | null;
          day?: number | null;
          start_time: number;
          duration: number;
          room: string;
          classroom?: number;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          subject?: number;
          teacher?: number;
          coteachers?: number[] | null;
          day?: number | null;
          start_time?: number;
          duration?: number;
          room?: string;
          classroom?: number;
        };
      };
      stats: {
        Row: {
          id: number;
          created_at: string;
          parent: Database["public"]["Tables"]["news"]["Row"];
        };
        Insert: {
          id?: number;
          created_at?: string;
          parent: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          parent?: number;
        };
      };
      student: {
        Row: {
          id: number;
          created_at: string | null;
          person: Database["public"]["Tables"]["people"]["Row"];
          std_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          person: number;
          std_id: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          person?: number;
          std_id?: string;
        };
      };
      subject: {
        Row: {
          id: number;
          created_at: string | null;
          name_th: string;
          name_en: string;
          code_th: string;
          code_en: string;
          type_th: Database["public"]["Enums"]["subject_type_th_enum"];
          type_en: Database["public"]["Enums"]["subject_type_en_enum"];
          credit: number;
          description_th: string | null;
          description_en: string | null;
          year: number;
          semester: number;
          group: number;
          syllabus: string | null;
          teachers: number[];
          coTeachers: number[] | null;
          short_name_th: string | null;
          short_name_en: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name_th: string;
          name_en: string;
          code_th: string;
          code_en: string;
          type_th: Database["public"]["Enums"]["subject_type_th_enum"];
          type_en: Database["public"]["Enums"]["subject_type_en_enum"];
          credit: number;
          description_th?: string | null;
          description_en?: string | null;
          year: number;
          semester: number;
          group: number;
          syllabus?: string | null;
          teachers: number[];
          coTeachers?: number[] | null;
          short_name_th?: string | null;
          short_name_en?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name_th?: string;
          name_en?: string;
          code_th?: string;
          code_en?: string;
          type_th?: Database["public"]["Enums"]["subject_type_th_enum"];
          type_en?: Database["public"]["Enums"]["subject_type_en_enum"];
          credit?: number;
          description_th?: string | null;
          description_en?: string | null;
          year?: number;
          semester?: number;
          group?: number;
          syllabus?: string | null;
          teachers?: number[];
          coTeachers?: number[] | null;
          short_name_th?: string | null;
          short_name_en?: string | null;
        };
      };
      SubjectGroup: {
        Row: {
          id: number;
          created_at: string | null;
          name_th: string;
          name_en: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name_th: string;
          name_en: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name_th?: string;
          name_en?: string;
        };
      };
      teacher: {
        Row: {
          id: number;
          created_at: string | null;
          person: Database["public"]["Tables"]["people"]["Row"];
          teacher_id: string;
          subject_group: Database["public"]["Tables"]["SubjectGroup"]["Row"];
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          person: number;
          teacher_id: string;
          subject_group?: number;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          person?: number;
          teacher_id?: string;
          subject_group?: number;
        };
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          role: string;
          student: number | null;
          teacher: number | null;
          is_admin: boolean;
          onboarded: boolean;
        };
        Insert: {
          id: string;
          email?: string | null;
          role?: string;
          student?: number | null;
          teacher?: number | null;
          is_admin?: boolean;
          onboarded?: boolean;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: string;
          student?: number | null;
          teacher?: number | null;
          is_admin?: boolean;
          onboarded?: boolean;
        };
      };
      vaccine_records: {
        Row: {
          id: number;
          created_at: string | null;
          person: number;
          vaccine_dose_no: number;
          vaccination_date: string;
          vaccine_name: string;
          lot_no: string;
          administering_center: string;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          person: number;
          vaccine_dose_no?: number;
          vaccination_date: string;
          vaccine_name?: string;
          lot_no?: string;
          administering_center?: string;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          person?: number;
          vaccine_dose_no?: number;
          vaccination_date?: string;
          vaccine_name?: string;
          lot_no?: string;
          administering_center?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      contact_type:
        | "Phone"
        | "Email"
        | "Facebook"
        | "Line"
        | "Instagram"
        | "Website"
        | "Discord"
        | "Other";
      form_frequency_enum: "once" | "weekly" | "monthly" | "unspecified";
      form_type_enum:
        | "short_answer"
        | "paragraph"
        | "multiple_choice"
        | "check_box"
        | "dropdown"
        | "file"
        | "date"
        | "time"
        | "scale";
      prefix_en_enum: "Master" | "Mr." | "Mrs." | "Miss.";
      prefix_th_enum: "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
      subject_type_en_enum:
        | "Core Courses"
        | "Elective Courses"
        | "Additional Courses"
        | "Learner’s Development Activities";
      subject_type_th_enum:
        | "รายวิชาพื้นฐาน"
        | "รายวิชาเพิ่มเติม"
        | "รายวิชาเลือก"
        | "กิจกรรมพัฒนาผู้เรียน";
    };
  };
}
