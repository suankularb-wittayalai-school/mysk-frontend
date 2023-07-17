export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      classroom: {
        Row: {
          advisors: number[];
          contacts: number[];
          created_at: string | null;
          id: number;
          no_list: number[];
          number: number;
          students: number[];
          subjects: number[];
          year: number;
        };
        Insert: {
          advisors: number[];
          contacts: number[];
          created_at?: string | null;
          id?: number;
          no_list?: number[];
          number: number;
          students: number[];
          subjects: number[];
          year: number;
        };
        Update: {
          advisors?: number[];
          contacts?: number[];
          created_at?: string | null;
          id?: number;
          no_list?: number[];
          number?: number;
          students?: number[];
          subjects?: number[];
          year?: number;
        };
        Relationships: [];
      };
      club_contacts: {
        Row: {
          club_id: string;
          contact_id: number;
          created_at: string | null;
          id: string;
        };
        Insert: {
          club_id: string;
          contact_id: number;
          created_at?: string | null;
          id?: string;
        };
        Update: {
          club_id?: string;
          contact_id?: number;
          created_at?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_contacts_club_id_fkey";
            columns: ["club_id"];
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_contacts_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          }
        ];
      };
      club_members: {
        Row: {
          club_id: string;
          created_at: string | null;
          id: string;
          membership_status: Database["public"]["Enums"]["submission_status"];
          student_id: number;
          year: number;
        };
        Insert: {
          club_id: string;
          created_at?: string | null;
          id?: string;
          membership_status?: Database["public"]["Enums"]["submission_status"];
          student_id: number;
          year: number;
        };
        Update: {
          club_id?: string;
          created_at?: string | null;
          id?: string;
          membership_status?: Database["public"]["Enums"]["submission_status"];
          student_id?: number;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "student";
            referencedColumns: ["id"];
          }
        ];
      };
      club_staffs: {
        Row: {
          club_id: string;
          created_at: string | null;
          id: string;
          position: string | null;
          student_id: number;
          year: number;
        };
        Insert: {
          club_id: string;
          created_at?: string | null;
          id?: string;
          position?: string | null;
          student_id: number;
          year: number;
        };
        Update: {
          club_id?: string;
          created_at?: string | null;
          id?: string;
          position?: string | null;
          student_id?: number;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_staffs_club_id_fkey";
            columns: ["club_id"];
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_staffs_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "student";
            referencedColumns: ["id"];
          }
        ];
      };
      clubs: {
        Row: {
          accent_color: string | null;
          background_color: string | null;
          created_at: string | null;
          house: Database["public"]["Enums"]["activity_day_houses"] | null;
          id: string;
          map_location: number | null;
          organization_id: string;
        };
        Insert: {
          accent_color?: string | null;
          background_color?: string | null;
          created_at?: string | null;
          house?: Database["public"]["Enums"]["activity_day_houses"] | null;
          id?: string;
          map_location?: number | null;
          organization_id: string;
        };
        Update: {
          accent_color?: string | null;
          background_color?: string | null;
          created_at?: string | null;
          house?: Database["public"]["Enums"]["activity_day_houses"] | null;
          id?: string;
          map_location?: number | null;
          organization_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clubs_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      contacts: {
        Row: {
          created_at: string | null;
          id: number;
          include_parents: boolean | null;
          include_students: boolean | null;
          include_teachers: boolean | null;
          name_en: string | null;
          name_th: string | null;
          type: Database["public"]["Enums"]["contact_type"];
          value: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          name_en?: string | null;
          name_th?: string | null;
          type: Database["public"]["Enums"]["contact_type"];
          value: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          name_en?: string | null;
          name_th?: string | null;
          type?: Database["public"]["Enums"]["contact_type"];
          value?: string;
        };
        Relationships: [];
      };
      form_field_value: {
        Row: {
          created_at: string | null;
          field: number;
          id: number;
          submission: number;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          field: number;
          id?: number;
          submission: number;
          value?: string;
        };
        Update: {
          created_at?: string | null;
          field?: number;
          id?: number;
          submission?: number;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "form_field_value_field_fkey";
            columns: ["field"];
            referencedRelation: "form_questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_field_value_submission_fkey";
            columns: ["submission"];
            referencedRelation: "form_submissions";
            referencedColumns: ["id"];
          }
        ];
      };
      form_questions: {
        Row: {
          created_at: string | null;
          default: string;
          form: number;
          id: number;
          label_en: string | null;
          label_th: string;
          options: string[] | null;
          range_end: number | null;
          range_start: number | null;
          required: boolean;
          type: Database["public"]["Enums"]["form_type_enum"];
        };
        Insert: {
          created_at?: string | null;
          default?: string;
          form: number;
          id?: number;
          label_en?: string | null;
          label_th?: string;
          options?: string[] | null;
          range_end?: number | null;
          range_start?: number | null;
          required?: boolean;
          type?: Database["public"]["Enums"]["form_type_enum"];
        };
        Update: {
          created_at?: string | null;
          default?: string;
          form?: number;
          id?: number;
          label_en?: string | null;
          label_th?: string;
          options?: string[] | null;
          range_end?: number | null;
          range_start?: number | null;
          required?: boolean;
          type?: Database["public"]["Enums"]["form_type_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "form_questions_form_fkey";
            columns: ["form"];
            referencedRelation: "forms";
            referencedColumns: ["id"];
          }
        ];
      };
      form_submissions: {
        Row: {
          created_at: string | null;
          form: number;
          id: number;
          person: number | null;
        };
        Insert: {
          created_at?: string | null;
          form: number;
          id?: number;
          person?: number | null;
        };
        Update: {
          created_at?: string | null;
          form?: number;
          id?: number;
          person?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_fkey";
            columns: ["form"];
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_submissions_person_fkey";
            columns: ["person"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          }
        ];
      };
      forms: {
        Row: {
          created_at: string;
          due_date: string | null;
          frequency: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id: number;
          parent: number;
          students_done: number[] | null;
        };
        Insert: {
          created_at?: string;
          due_date?: string | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id?: number;
          parent: number;
          students_done?: number[] | null;
        };
        Update: {
          created_at?: string;
          due_date?: string | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id?: number;
          parent?: number;
          students_done?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "forms_parent_fkey";
            columns: ["parent"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      infos: {
        Row: {
          body_en: string;
          body_th: string;
          created_at: string;
          id: number;
          parent: number;
        };
        Insert: {
          body_en: string;
          body_th: string;
          created_at?: string;
          id?: number;
          parent: number;
        };
        Update: {
          body_en?: string;
          body_th?: string;
          created_at?: string;
          id?: number;
          parent?: number;
        };
        Relationships: [
          {
            foreignKeyName: "infos_parent_fkey";
            columns: ["parent"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      news: {
        Row: {
          created_at: string;
          description_en: string | null;
          description_th: string;
          id: number;
          image: string | null;
          old_url: string | null;
          title_en: string | null;
          title_th: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_th?: string;
          id?: number;
          image?: string | null;
          old_url?: string | null;
          title_en?: string | null;
          title_th?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_th?: string;
          id?: number;
          image?: string | null;
          old_url?: string | null;
          title_en?: string | null;
          title_th?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          created_at: string | null;
          description_en: string | null;
          description_th: string | null;
          id: string;
          logo_url: string | null;
          main_room: string | null;
          name_en: string | null;
          name_th: string;
        };
        Insert: {
          created_at?: string | null;
          description_en?: string | null;
          description_th?: string | null;
          id?: string;
          logo_url?: string | null;
          main_room?: string | null;
          name_en?: string | null;
          name_th: string;
        };
        Update: {
          created_at?: string | null;
          description_en?: string | null;
          description_th?: string | null;
          id?: string;
          logo_url?: string | null;
          main_room?: string | null;
          name_en?: string | null;
          name_th?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount_owed: number | null;
          created_at: string;
          due_date: string | null;
          frequency: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id: number;
          parent: number;
          students_done: number[] | null;
        };
        Insert: {
          amount_owed?: number | null;
          created_at?: string;
          due_date?: string | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id?: number;
          parent: number;
          students_done?: number[] | null;
        };
        Update: {
          amount_owed?: number | null;
          created_at?: string;
          due_date?: string | null;
          frequency?: Database["public"]["Enums"]["form_frequency_enum"] | null;
          id?: number;
          parent?: number;
          students_done?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_parent_fkey";
            columns: ["parent"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      people: {
        Row: {
          birthdate: string;
          citizen_id: string;
          contacts: number[] | null;
          created_at: string | null;
          first_name_en: string | null;
          first_name_th: string;
          id: number;
          last_name_en: string | null;
          last_name_th: string;
          middle_name_en: string | null;
          middle_name_th: string | null;
          nickname_en: string | null;
          nickname_th: string | null;
          pants_size: string | null;
          prefix_en: string | null;
          prefix_th: string;
          profile: string | null;
          shirt_size: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Insert: {
          birthdate: string;
          citizen_id: string;
          contacts?: number[] | null;
          created_at?: string | null;
          first_name_en?: string | null;
          first_name_th: string;
          id?: number;
          last_name_en?: string | null;
          last_name_th: string;
          middle_name_en?: string | null;
          middle_name_th?: string | null;
          nickname_en?: string | null;
          nickname_th?: string | null;
          pants_size?: string | null;
          prefix_en?: string | null;
          prefix_th: string;
          profile?: string | null;
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Update: {
          birthdate?: string;
          citizen_id?: string;
          contacts?: number[] | null;
          created_at?: string | null;
          first_name_en?: string | null;
          first_name_th?: string;
          id?: number;
          last_name_en?: string | null;
          last_name_th?: string;
          middle_name_en?: string | null;
          middle_name_th?: string | null;
          nickname_en?: string | null;
          nickname_th?: string | null;
          pants_size?: string | null;
          prefix_en?: string | null;
          prefix_th?: string;
          profile?: string | null;
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Relationships: [];
      };
      people_allergies: {
        Row: {
          allergy_name: string;
          created_at: string | null;
          id: number;
          person_id: number;
        };
        Insert: {
          allergy_name: string;
          created_at?: string | null;
          id?: number;
          person_id: number;
        };
        Update: {
          allergy_name?: string;
          created_at?: string | null;
          id?: number;
          person_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "people_allergies_person_id_fkey";
            columns: ["person_id"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          }
        ];
      };
      room_subjects: {
        Row: {
          class: number;
          coteacher: number[] | null;
          created_at: string | null;
          gg_meet_link: string | null;
          ggc_code: string | null;
          ggc_link: string | null;
          id: number;
          semester: number;
          subject: number;
          teacher: number[];
          year: number;
        };
        Insert: {
          class: number;
          coteacher?: number[] | null;
          created_at?: string | null;
          gg_meet_link?: string | null;
          ggc_code?: string | null;
          ggc_link?: string | null;
          id?: number;
          semester?: number;
          subject: number;
          teacher: number[];
          year?: number;
        };
        Update: {
          class?: number;
          coteacher?: number[] | null;
          created_at?: string | null;
          gg_meet_link?: string | null;
          ggc_code?: string | null;
          ggc_link?: string | null;
          id?: number;
          semester?: number;
          subject?: number;
          teacher?: number[];
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "room_subjects_class_fkey";
            columns: ["class"];
            referencedRelation: "classroom";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_subjects_subject_fkey";
            columns: ["subject"];
            referencedRelation: "subject";
            referencedColumns: ["id"];
          }
        ];
      };
      schedule_items: {
        Row: {
          classroom: number | null;
          coteachers: number[] | null;
          created_at: string | null;
          day: number | null;
          duration: number;
          id: number;
          room: string;
          semester: number;
          start_time: number;
          subject: number;
          teacher: number;
          year: number;
        };
        Insert: {
          classroom?: number | null;
          coteachers?: number[] | null;
          created_at?: string | null;
          day?: number | null;
          duration: number;
          id?: number;
          room: string;
          semester: number;
          start_time: number;
          subject: number;
          teacher: number;
          year: number;
        };
        Update: {
          classroom?: number | null;
          coteachers?: number[] | null;
          created_at?: string | null;
          day?: number | null;
          duration?: number;
          id?: number;
          room?: string;
          semester?: number;
          start_time?: number;
          subject?: number;
          teacher?: number;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_items_classroom_fkey";
            columns: ["classroom"];
            referencedRelation: "classroom";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_items_subject_fkey";
            columns: ["subject"];
            referencedRelation: "subject";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_items_teacher_fkey";
            columns: ["teacher"];
            referencedRelation: "teacher";
            referencedColumns: ["id"];
          }
        ];
      };
      school_documents: {
        Row: {
          attend_to: string | null;
          code: string;
          created_at: string | null;
          date: string;
          document_link: string;
          id: number;
          include_parents: boolean | null;
          include_students: boolean | null;
          include_teachers: boolean | null;
          subject: string;
          type: string;
        };
        Insert: {
          attend_to?: string | null;
          code?: string;
          created_at?: string | null;
          date: string;
          document_link?: string;
          id?: number;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          subject?: string;
          type: string;
        };
        Update: {
          attend_to?: string | null;
          code?: string;
          created_at?: string | null;
          date?: string;
          document_link?: string;
          id?: number;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          subject?: string;
          type?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          created_at: string | null;
          id: number;
          language: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          language?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          language?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      stats: {
        Row: {
          created_at: string;
          id: number;
          parent: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          parent: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          parent?: number;
        };
        Relationships: [
          {
            foreignKeyName: "stats_parent_fkey";
            columns: ["parent"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      student: {
        Row: {
          created_at: string | null;
          id: number;
          person: number;
          std_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          person: number;
          std_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          person?: number;
          std_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_person_fkey";
            columns: ["person"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          }
        ];
      };
      subject: {
        Row: {
          code_en: string;
          code_th: string;
          coTeachers: number[] | null;
          created_at: string | null;
          credit: number;
          description_en: string | null;
          description_th: string | null;
          group: number;
          id: number;
          name_en: string;
          name_th: string;
          semester: number;
          short_name_en: string | null;
          short_name_th: string | null;
          syllabus: string | null;
          teachers: number[];
          type_en: Database["public"]["Enums"]["subject_type_en_enum"];
          type_th: Database["public"]["Enums"]["subject_type_th_enum"];
          year: number;
        };
        Insert: {
          code_en: string;
          code_th: string;
          coTeachers?: number[] | null;
          created_at?: string | null;
          credit: number;
          description_en?: string | null;
          description_th?: string | null;
          group: number;
          id?: number;
          name_en: string;
          name_th: string;
          semester: number;
          short_name_en?: string | null;
          short_name_th?: string | null;
          syllabus?: string | null;
          teachers: number[];
          type_en: Database["public"]["Enums"]["subject_type_en_enum"];
          type_th: Database["public"]["Enums"]["subject_type_th_enum"];
          year: number;
        };
        Update: {
          code_en?: string;
          code_th?: string;
          coTeachers?: number[] | null;
          created_at?: string | null;
          credit?: number;
          description_en?: string | null;
          description_th?: string | null;
          group?: number;
          id?: number;
          name_en?: string;
          name_th?: string;
          semester?: number;
          short_name_en?: string | null;
          short_name_th?: string | null;
          syllabus?: string | null;
          teachers?: number[];
          type_en?: Database["public"]["Enums"]["subject_type_en_enum"];
          type_th?: Database["public"]["Enums"]["subject_type_th_enum"];
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "subject_group_fkey";
            columns: ["group"];
            referencedRelation: "SubjectGroup";
            referencedColumns: ["id"];
          }
        ];
      };
      SubjectGroup: {
        Row: {
          created_at: string | null;
          id: number;
          name_en: string;
          name_th: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name_en: string;
          name_th: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name_en?: string;
          name_th?: string;
        };
        Relationships: [];
      };
      teacher: {
        Row: {
          created_at: string | null;
          id: number;
          person: number;
          subject_group: number;
          teacher_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          person: number;
          subject_group: number;
          teacher_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          person?: number;
          subject_group?: number;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teacher_person_fkey";
            columns: ["person"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teacher_subject_group_fkey";
            columns: ["subject_group"];
            referencedRelation: "SubjectGroup";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          email: string | null;
          id: string;
          is_admin: boolean;
          onboarded: boolean;
          role: string;
          student: number | null;
          teacher: number | null;
        };
        Insert: {
          email?: string | null;
          id: string;
          is_admin?: boolean;
          onboarded?: boolean;
          role?: string;
          student?: number | null;
          teacher?: number | null;
        };
        Update: {
          email?: string | null;
          id?: string;
          is_admin?: boolean;
          onboarded?: boolean;
          role?: string;
          student?: number | null;
          teacher?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_student_fkey";
            columns: ["student"];
            referencedRelation: "student";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_teacher_fkey";
            columns: ["teacher"];
            referencedRelation: "teacher";
            referencedColumns: ["id"];
          }
        ];
      };
      vaccine_records: {
        Row: {
          administering_center: string;
          created_at: string | null;
          id: number;
          lot_no: string;
          person: number;
          vaccination_date: string;
          vaccine_name: string;
        };
        Insert: {
          administering_center?: string;
          created_at?: string | null;
          id?: number;
          lot_no?: string;
          person: number;
          vaccination_date: string;
          vaccine_name?: string;
        };
        Update: {
          administering_center?: string;
          created_at?: string | null;
          id?: number;
          lot_no?: string;
          person?: number;
          vaccination_date?: string;
          vaccine_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vaccine_records_person_fkey";
            columns: ["person"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      diesel_manage_updated_at: {
        Args: {
          _tbl: unknown;
        };
        Returns: undefined;
      };
    };
    Enums: {
      activity_day_houses: "felis" | "cornicula" | "sciurus" | "cyprinus";
      blood_group: "O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+";
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
      shirt_size:
        | "XS"
        | "S"
        | "M"
        | "L"
        | "XL"
        | "2XL"
        | "3XL"
        | "4XL"
        | "5XL"
        | "6XL";
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
      submission_status: "approved" | "pending" | "declined";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
