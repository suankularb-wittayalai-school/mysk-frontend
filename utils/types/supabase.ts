export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      classroom_advisors: {
        Row: {
          classroom_id: string;
          created_at: string | null;
          id: string;
          teacher_id: string;
        };
        Insert: {
          classroom_id: string;
          created_at?: string | null;
          id?: string;
          teacher_id: string;
        };
        Update: {
          classroom_id?: string;
          created_at?: string | null;
          id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_advisors_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_advisors_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_contacts: {
        Row: {
          classroom_id: string;
          contact_id: string;
          created_at: string | null;
          id: string;
        };
        Insert: {
          classroom_id: string;
          contact_id: string;
          created_at?: string | null;
          id?: string;
        };
        Update: {
          classroom_id?: string;
          contact_id?: string;
          created_at?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_contacts_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_contacts_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_homeroom_contents: {
        Row: {
          classroom_id: string;
          created_at: string;
          date: string;
          homeroom_content: string;
          id: string;
        };
        Insert: {
          classroom_id: string;
          created_at?: string;
          date: string;
          homeroom_content: string;
          id?: string;
        };
        Update: {
          classroom_id?: string;
          created_at?: string;
          date?: string;
          homeroom_content?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_homeroom_contents_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_students: {
        Row: {
          class_no: number;
          classroom_id: string;
          created_at: string | null;
          id: number;
          student_id: string;
        };
        Insert: {
          class_no: number;
          classroom_id: string;
          created_at?: string | null;
          id?: number;
          student_id: string;
        };
        Update: {
          class_no?: number;
          classroom_id?: string;
          created_at?: string | null;
          id?: number;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_students_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_students_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_subject_co_teachers: {
        Row: {
          classroom_subject_id: string;
          created_at: string | null;
          id: string;
          teacher_id: string;
        };
        Insert: {
          classroom_subject_id: string;
          created_at?: string | null;
          id?: string;
          teacher_id: string;
        };
        Update: {
          classroom_subject_id?: string;
          created_at?: string | null;
          id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_subject_co_teachers_classroom_subject_id_fkey";
            columns: ["classroom_subject_id"];
            isOneToOne: false;
            referencedRelation: "classroom_subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_subject_co_teachers_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_subject_teachers: {
        Row: {
          classroom_subject_id: string;
          created_at: string | null;
          id: string;
          teacher_id: string;
        };
        Insert: {
          classroom_subject_id: string;
          created_at?: string | null;
          id?: string;
          teacher_id: string;
        };
        Update: {
          classroom_subject_id?: string;
          created_at?: string | null;
          id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_subject_teachers_classroom_subject_id_fkey";
            columns: ["classroom_subject_id"];
            isOneToOne: false;
            referencedRelation: "classroom_subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_subject_teachers_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_subjects: {
        Row: {
          classroom_id: string;
          created_at: string | null;
          gg_meet_link: string | null;
          ggc_code: string | null;
          ggc_link: string | null;
          id: string;
          legacy_classroom_id: number | null;
          legacy_id: number;
          legacy_subject_id: number | null;
          semester: number;
          subject_id: string;
          year: number;
        };
        Insert: {
          classroom_id: string;
          created_at?: string | null;
          gg_meet_link?: string | null;
          ggc_code?: string | null;
          ggc_link?: string | null;
          id?: string;
          legacy_classroom_id?: number | null;
          legacy_id?: number;
          legacy_subject_id?: number | null;
          semester?: number;
          subject_id: string;
          year?: number;
        };
        Update: {
          classroom_id?: string;
          created_at?: string | null;
          gg_meet_link?: string | null;
          ggc_code?: string | null;
          ggc_link?: string | null;
          id?: string;
          legacy_classroom_id?: number | null;
          legacy_id?: number;
          legacy_subject_id?: number | null;
          semester?: number;
          subject_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_subjects_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_subjects_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      classrooms: {
        Row: {
          created_at: string | null;
          id: string;
          legacy_id: number;
          main_room: string | null;
          number: number;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          main_room?: string | null;
          number: number;
          year: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          main_room?: string | null;
          number?: number;
          year?: number;
        };
        Relationships: [];
      };
      club_contacts: {
        Row: {
          club_id: string;
          contact_id: string | null;
          created_at: string | null;
          id: string;
          legacy_contact_id: number;
        };
        Insert: {
          club_id: string;
          contact_id?: string | null;
          created_at?: string | null;
          id?: string;
          legacy_contact_id: number;
        };
        Update: {
          club_id?: string;
          contact_id?: string | null;
          created_at?: string | null;
          id?: string;
          legacy_contact_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_contacts_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_club_contacts_classrooms";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      club_members: {
        Row: {
          club_id: string;
          created_at: string | null;
          id: string;
          legacy_student_id: number;
          membership_status: Database["public"]["Enums"]["submission_status"];
          student_id: string | null;
          year: number;
        };
        Insert: {
          club_id: string;
          created_at?: string | null;
          id?: string;
          legacy_student_id: number;
          membership_status?: Database["public"]["Enums"]["submission_status"];
          student_id?: string | null;
          year: number;
        };
        Update: {
          club_id?: string;
          created_at?: string | null;
          id?: string;
          legacy_student_id?: number;
          membership_status?: Database["public"]["Enums"]["submission_status"];
          student_id?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_members";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_staffs: {
        Row: {
          club_id: string;
          created_at: string | null;
          id: string;
          legacy_student_id: number;
          position: string | null;
          student_id: string | null;
          year: number;
        };
        Insert: {
          club_id: string;
          created_at?: string | null;
          id?: string;
          legacy_student_id: number;
          position?: string | null;
          student_id?: string | null;
          year: number;
        };
        Update: {
          club_id?: string;
          created_at?: string | null;
          id?: string;
          legacy_student_id?: number;
          position?: string | null;
          student_id?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_staffs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
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
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          created_at: string | null;
          id: string;
          include_parents: boolean | null;
          include_students: boolean | null;
          include_teachers: boolean | null;
          legacy_id: number;
          name_en: string | null;
          name_th: string | null;
          type: Database["public"]["Enums"]["contact_types"];
          value: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          legacy_id?: number;
          name_en?: string | null;
          name_th?: string | null;
          type: Database["public"]["Enums"]["contact_types"];
          value: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          legacy_id?: number;
          name_en?: string | null;
          name_th?: string | null;
          type?: Database["public"]["Enums"]["contact_types"];
          value?: string;
        };
        Relationships: [];
      };
      elective_subject_classrooms: {
        Row: {
          classroom_id: string;
          created_at: string;
          elective_subject_id: string;
          id: string;
          session_code: number | null;
        };
        Insert: {
          classroom_id: string;
          created_at?: string;
          elective_subject_id: string;
          id?: string;
          session_code?: number | null;
        };
        Update: {
          classroom_id?: string;
          created_at?: string;
          elective_subject_id?: string;
          id?: string;
          session_code?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_elective_subject_classrooms_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_elective_subject_classrooms_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "complete_elective_subjects_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_elective_subject_classrooms_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "elective_subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_enrollment_periods: {
        Row: {
          created_at: string;
          end_time: string;
          id: string;
          start_time: string;
        };
        Insert: {
          created_at?: string;
          end_time: string;
          id?: string;
          start_time: string;
        };
        Update: {
          created_at?: string;
          end_time?: string;
          id?: string;
          start_time?: string;
        };
        Relationships: [];
      };
      elective_subject_requirements: {
        Row: {
          created_at: string;
          elective_subject_id: string;
          id: string;
          label_en: string | null;
          label_th: string;
        };
        Insert: {
          created_at?: string;
          elective_subject_id: string;
          id?: string;
          label_en?: string | null;
          label_th: string;
        };
        Update: {
          created_at?: string;
          elective_subject_id?: string;
          id?: string;
          label_en?: string | null;
          label_th?: string;
        };
        Relationships: [
          {
            foreignKeyName: "elective_subject_requirements_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "complete_elective_subjects_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_requirements_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "elective_subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_session_classrooms: {
        Row: {
          classroom_id: string;
          created_at: string;
          elective_subject_session_id: string;
          id: string;
        };
        Insert: {
          classroom_id: string;
          created_at?: string;
          elective_subject_session_id: string;
          id?: string;
        };
        Update: {
          classroom_id?: string;
          created_at?: string;
          elective_subject_session_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "elective_subject_session_class_elective_subject_session_id_fkey";
            columns: ["elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_session_class_elective_subject_session_id_fkey";
            columns: ["elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions_with_detail_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_session_classrooms_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_session_enrolled_students: {
        Row: {
          created_at: string;
          elective_subject_session_id: string;
          id: string;
          is_randomized: boolean;
          student_id: string;
        };
        Insert: {
          created_at?: string;
          elective_subject_session_id: string;
          id?: string;
          is_randomized?: boolean;
          student_id: string;
        };
        Update: {
          created_at?: string;
          elective_subject_session_id?: string;
          id?: string;
          is_randomized?: boolean;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "elective_subjects_session_enro_elective_subject_session_id_fkey";
            columns: ["elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subjects_session_enro_elective_subject_session_id_fkey";
            columns: ["elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions_with_detail_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subjects_session_enrolled_students_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_sessions: {
        Row: {
          cap_size: number;
          created_at: string;
          id: string;
          room: string;
          semester: number;
          session_code: string;
          subject_id: string;
          year: number;
        };
        Insert: {
          cap_size: number;
          created_at?: string;
          id?: string;
          room: string;
          semester: number;
          session_code: string;
          subject_id: string;
          year: number;
        };
        Update: {
          cap_size?: number;
          created_at?: string;
          id?: string;
          room?: string;
          semester?: number;
          session_code?: string;
          subject_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "elective_subject_sessions_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_trade_offers: {
        Row: {
          created_at: string;
          id: string;
          receiver_elective_subject_session_id: string;
          receiver_id: string;
          sender_elective_subject_session_id: string;
          sender_id: string;
          status: Database["public"]["Enums"]["submission_status"];
        };
        Insert: {
          created_at?: string;
          id?: string;
          receiver_elective_subject_session_id: string;
          receiver_id: string;
          sender_elective_subject_session_id: string;
          sender_id: string;
          status?: Database["public"]["Enums"]["submission_status"];
        };
        Update: {
          created_at?: string;
          id?: string;
          receiver_elective_subject_session_id?: string;
          receiver_id?: string;
          sender_elective_subject_session_id?: string;
          sender_id?: string;
          status?: Database["public"]["Enums"]["submission_status"];
        };
        Relationships: [
          {
            foreignKeyName: "elective_subject_trade_offers_receiver_elective_subject_se_fkey";
            columns: ["receiver_elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_trade_offers_receiver_elective_subject_se_fkey";
            columns: ["receiver_elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions_with_detail_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_trade_offers_sender_elective_subject_sess_fkey";
            columns: ["sender_elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "elective_subject_trade_offers_sender_elective_subject_sess_fkey";
            columns: ["sender_elective_subject_session_id"];
            isOneToOne: false;
            referencedRelation: "elective_subject_sessions_with_detail_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_elective_subject_trade_offers_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_elective_subject_trade_offers_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subjects: {
        Row: {
          cap_size: number;
          created_at: string;
          id: string;
          room: string;
          subject_id: string;
        };
        Insert: {
          cap_size: number;
          created_at?: string;
          id?: string;
          room: string;
          subject_id: string;
        };
        Update: {
          cap_size?: number;
          created_at?: string;
          id?: string;
          room?: string;
          subject_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_elective_subjects_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      infos: {
        Row: {
          body_en: string;
          body_th: string;
          created_at: string;
          id: string;
          legacy_id: number;
          legacy_news_id: number;
          news_id: string | null;
        };
        Insert: {
          body_en: string;
          body_th: string;
          created_at?: string;
          id?: string;
          legacy_id?: number;
          legacy_news_id: number;
          news_id?: string | null;
        };
        Update: {
          body_en?: string;
          body_th?: string;
          created_at?: string;
          id?: string;
          legacy_id?: number;
          legacy_news_id?: number;
          news_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_infos_news";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
        ];
      };
      news: {
        Row: {
          created_at: string;
          description_en: string | null;
          description_th: string;
          id: string;
          image: string | null;
          legacy_id: number;
          old_url: string | null;
          title_en: string | null;
          title_th: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_th?: string;
          id?: string;
          image?: string | null;
          legacy_id?: number;
          old_url?: string | null;
          title_en?: string | null;
          title_th?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_th?: string;
          id?: string;
          image?: string | null;
          legacy_id?: number;
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
          user_id: string | null;
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
          user_id?: string | null;
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
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      people: {
        Row: {
          birthdate: string | null;
          blood_group: Database["public"]["Enums"]["blood_group"] | null;
          citizen_id: string | null;
          created_at: string | null;
          first_name_en: string | null;
          first_name_th: string;
          id: string;
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
          sex: Database["public"]["Enums"]["sex"];
          shirt_size: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Insert: {
          birthdate?: string | null;
          blood_group?: Database["public"]["Enums"]["blood_group"] | null;
          citizen_id?: string | null;
          created_at?: string | null;
          first_name_en?: string | null;
          first_name_th: string;
          id?: string;
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
          sex: Database["public"]["Enums"]["sex"];
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Update: {
          birthdate?: string | null;
          blood_group?: Database["public"]["Enums"]["blood_group"] | null;
          citizen_id?: string | null;
          created_at?: string | null;
          first_name_en?: string | null;
          first_name_th?: string;
          id?: string;
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
          sex?: Database["public"]["Enums"]["sex"];
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      person_allergies: {
        Row: {
          allergy_name: string;
          created_at: string | null;
          id: string;
          legacy_id: number;
          legacy_person_id: number | null;
          person_id: string;
        };
        Insert: {
          allergy_name: string;
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id: string;
        };
        Update: {
          allergy_name?: string;
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "person_allergies_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      person_contacts: {
        Row: {
          contact_id: string;
          created_at: string | null;
          id: string;
          person_id: string;
        };
        Insert: {
          contact_id: string;
          created_at?: string | null;
          id?: string;
          person_id: string;
        };
        Update: {
          contact_id?: string;
          created_at?: string | null;
          id?: string;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "person_contacts_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "person_contacts_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      person_images: {
        Row: {
          created_at: string;
          date_taken: string | null;
          id: string;
          image_url: string;
          person_id: string;
        };
        Insert: {
          created_at?: string;
          date_taken?: string | null;
          id?: string;
          image_url: string;
          person_id: string;
        };
        Update: {
          created_at?: string;
          date_taken?: string | null;
          id?: string;
          image_url?: string;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "person_images_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_item_classroom_subjects: {
        Row: {
          classroom_subject_id: string;
          created_at: string | null;
          id: string;
          schedule_item_id: string;
        };
        Insert: {
          classroom_subject_id: string;
          created_at?: string | null;
          id?: string;
          schedule_item_id: string;
        };
        Update: {
          classroom_subject_id?: string;
          created_at?: string | null;
          id?: string;
          schedule_item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_item_classroom_subjects_classroom_subject_id_fkey";
            columns: ["classroom_subject_id"];
            isOneToOne: false;
            referencedRelation: "classroom_subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_item_classroom_subjects_schedule_item_id_fkey";
            columns: ["schedule_item_id"];
            isOneToOne: false;
            referencedRelation: "schedule_items";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_item_classrooms: {
        Row: {
          classroom_id: string;
          created_at: string | null;
          id: string;
          schedule_item_id: string;
        };
        Insert: {
          classroom_id: string;
          created_at?: string | null;
          id?: string;
          schedule_item_id: string;
        };
        Update: {
          classroom_id?: string;
          created_at?: string | null;
          id?: string;
          schedule_item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_item_classrooms_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_item_classrooms_schedule_item_id_fkey";
            columns: ["schedule_item_id"];
            isOneToOne: false;
            referencedRelation: "schedule_items";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_item_rooms: {
        Row: {
          created_at: string | null;
          id: string;
          room: string;
          schedule_item_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          room: string;
          schedule_item_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          room?: string;
          schedule_item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_item_rooms_schedule_item_id_fkey";
            columns: ["schedule_item_id"];
            isOneToOne: false;
            referencedRelation: "schedule_items";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_item_teachers: {
        Row: {
          created_at: string | null;
          id: string;
          schedule_item_id: string;
          teacher_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          schedule_item_id: string;
          teacher_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          schedule_item_id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_item_teachers_schedule_item_id_fkey";
            columns: ["schedule_item_id"];
            isOneToOne: false;
            referencedRelation: "schedule_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_item_teachers_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_items: {
        Row: {
          created_at: string | null;
          day: number;
          duration: number;
          id: string;
          legacy_classroom_id: number | null;
          legacy_id: number;
          legacy_subject_id: number | null;
          semester: number;
          start_time: number;
          subject_id: string;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          day: number;
          duration: number;
          id?: string;
          legacy_classroom_id?: number | null;
          legacy_id?: number;
          legacy_subject_id?: number | null;
          semester: number;
          start_time: number;
          subject_id: string;
          year: number;
        };
        Update: {
          created_at?: string | null;
          day?: number;
          duration?: number;
          id?: string;
          legacy_classroom_id?: number | null;
          legacy_id?: number;
          legacy_subject_id?: number | null;
          semester?: number;
          start_time?: number;
          subject_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_items_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      school_documents: {
        Row: {
          attend_to: string | null;
          code: string;
          created_at: string | null;
          date: string;
          document_link: string;
          id: string;
          include_parents: boolean | null;
          include_students: boolean | null;
          include_teachers: boolean | null;
          legacy_id: number | null;
          subject: string;
          type: Database["public"]["Enums"]["school_document_type"];
        };
        Insert: {
          attend_to?: string | null;
          code?: string;
          created_at?: string | null;
          date: string;
          document_link?: string;
          id?: string;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          legacy_id?: number | null;
          subject?: string;
          type: Database["public"]["Enums"]["school_document_type"];
        };
        Update: {
          attend_to?: string | null;
          code?: string;
          created_at?: string | null;
          date?: string;
          document_link?: string;
          id?: string;
          include_parents?: boolean | null;
          include_students?: boolean | null;
          include_teachers?: boolean | null;
          legacy_id?: number | null;
          subject?: string;
          type?: Database["public"]["Enums"]["school_document_type"];
        };
        Relationships: [];
      };
      student_attendances: {
        Row: {
          absence_reason: string | null;
          absence_type: Database["public"]["Enums"]["absence_type"] | null;
          attendance_event: Database["public"]["Enums"]["attendance_event"];
          checker_id: string | null;
          created_at: string;
          date: string;
          id: string;
          is_present: boolean;
          student_id: string;
        };
        Insert: {
          absence_reason?: string | null;
          absence_type?: Database["public"]["Enums"]["absence_type"] | null;
          attendance_event: Database["public"]["Enums"]["attendance_event"];
          checker_id?: string | null;
          created_at?: string;
          date: string;
          id?: string;
          is_present?: boolean;
          student_id: string;
        };
        Update: {
          absence_reason?: string | null;
          absence_type?: Database["public"]["Enums"]["absence_type"] | null;
          attendance_event?: Database["public"]["Enums"]["attendance_event"];
          checker_id?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          is_present?: boolean;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_attendances_checker_id_fkey";
            columns: ["checker_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "student_attendances_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      cheer_practice_staffs: {
        Row: { id: string; created_at: string; student_id: string };
        Insert: { id: string; created_at: string; student_id: string };
        Update: { id: string; created_at: string; student_id: string };
      };
      cheer_practice_blacklisted_students: {
        Row: { id: string; created_at: string; student_id: string };
        Insert: { id: string; created_at: string; student_id: string };
        Update: { id: string; created_at: string; student_id: string };
      };
      cheer_practice_teachers: {
        Row: { id: string; created_at: string; teacher_id: string };
        Insert: { id: string; created_at: string; teacher_id: string };
        Update: { id: string; created_at: string; teacher_id: string };
      };
      student_certificates: {
        Row: {
          certificate_detail: string;
          certificate_type: Database["public"]["Enums"]["certificate_type"];
          created_at: string;
          id: string;
          receiving_order_number: number | null;
          seat_code: string | null;
          student_id: string;
          year: number;
          rsvp_status: Database["public"]["Enums"]["submission_status"];
        };
        Insert: {
          certificate_detail: string;
          certificate_type: Database["public"]["Enums"]["certificate_type"];
          created_at?: string;
          id?: string;
          receiving_order_number?: number | null;
          seat_code?: string | null;
          student_id: string;
          year: number;
          rsvp_status: Database["public"]["Enums"]["submission_status"];
        };
        Update: {
          certificate_detail?: string;
          certificate_type?: Database["public"]["Enums"]["certificate_type"];
          created_at?: string;
          id?: string;
          receiving_order_number?: number | null;
          seat_code?: string | null;
          student_id?: string;
          year?: number;
          rsvp_status: Database["public"]["Enums"]["submission_status"];
        };
        Relationships: [
          {
            foreignKeyName: "student_certificates_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      student_elective_subjects: {
        Row: {
          created_at: string;
          elective_subject_id: string;
          id: string;
          is_randomized: boolean;
          semester: number | null;
          student_id: string;
          year: number | null;
        };
        Insert: {
          created_at?: string;
          elective_subject_id: string;
          id?: string;
          is_randomized?: boolean;
          semester?: number | null;
          student_id: string;
          year?: number | null;
        };
        Update: {
          created_at?: string;
          elective_subject_id?: string;
          id?: string;
          is_randomized?: boolean;
          semester?: number | null;
          student_id?: string;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_student_elective_subjects_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "complete_elective_subjects_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_student_elective_subjects_elective_subject_id_fkey";
            columns: ["elective_subject_id"];
            isOneToOne: false;
            referencedRelation: "elective_subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_student_elective_subjects_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          created_at: string | null;
          id: string;
          legacy_id: number;
          legacy_person_id: number | null;
          person_id: string;
          student_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id: string;
          student_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id?: string;
          student_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "students_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      cheer_practice_medical_risk_students: {
        Row: {
          created_at: string | null;
          id: string;
          risk_priority: number;
          student_id: string;
          condition: string;
          practice_period_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          risk_priority: number;
          student_id: string;
          condition: string;
          practice_period_id: string;
        };
        Update: {
          created_at?: string | null;
          id: string;
          risk_priority?: number;
          student_id?: string;
          condition?: string;
          practice_period_id: string;
        };
        Relationships: [
          {
            foreignKeyName: "cheer_practice_medical_risk_students_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cheer_practice_medical_risk_students_practice_period_id_fkey";
            columns: ["practice_period_id"];
            isOneToOne: false;
            referencedRelation: "cheer_practice_periods";
            referencedColumns: ["id"];
          },
        ];
      };
      subject_co_teachers: {
        Row: {
          created_at: string | null;
          id: string;
          subject_id: string;
          teacher_id: string;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          subject_id: string;
          teacher_id: string;
          year: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          subject_id?: string;
          teacher_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "subject_co_teachers_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subject_co_teachers_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      subject_groups: {
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
      subject_requirements: {
        Row: {
          created_at: string;
          id: string;
          label_en: string | null;
          label_th: string;
          subject_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label_en?: string | null;
          label_th: string;
          subject_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label_en?: string | null;
          label_th?: string;
          subject_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subject_requirements_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      subject_teachers: {
        Row: {
          created_at: string | null;
          id: string;
          subject_id: string;
          teacher_id: string;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          subject_id: string;
          teacher_id: string;
          year: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          subject_id?: string;
          teacher_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "subject_teachers_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subject_teachers_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
      };
      subjects: {
        Row: {
          code_en: string;
          code_th: string;
          created_at: string | null;
          credit: number;
          description_en: string | null;
          description_th: string | null;
          id: string;
          legacy_id: number;
          name_en: string;
          name_th: string;
          semester: number | null;
          short_name_en: string | null;
          short_name_th: string | null;
          subject_group_id: number;
          syllabus: string | null;
          type: Database["public"]["Enums"]["subject_type_en_enum"];
        };
        Insert: {
          code_en: string;
          code_th: string;
          created_at?: string | null;
          credit: number;
          description_en?: string | null;
          description_th?: string | null;
          id?: string;
          legacy_id?: number;
          name_en: string;
          name_th: string;
          semester?: number | null;
          short_name_en?: string | null;
          short_name_th?: string | null;
          subject_group_id: number;
          syllabus?: string | null;
          type: Database["public"]["Enums"]["subject_type_en_enum"];
        };
        Update: {
          code_en?: string;
          code_th?: string;
          created_at?: string | null;
          credit?: number;
          description_en?: string | null;
          description_th?: string | null;
          id?: string;
          legacy_id?: number;
          name_en?: string;
          name_th?: string;
          semester?: number | null;
          short_name_en?: string | null;
          short_name_th?: string | null;
          subject_group_id?: number;
          syllabus?: string | null;
          type?: Database["public"]["Enums"]["subject_type_en_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "subjects_subject_group_id_fkey";
            columns: ["subject_group_id"];
            isOneToOne: false;
            referencedRelation: "subject_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      teachers: {
        Row: {
          created_at: string | null;
          id: string;
          legacy_id: number;
          legacy_person_id: number | null;
          person_id: string;
          subject_group_id: number;
          teacher_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id: string;
          subject_group_id: number;
          teacher_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number | null;
          person_id?: string;
          subject_group_id?: number;
          teacher_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "teachers_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teachers_subject_group_id_fkey";
            columns: ["subject_group_id"];
            isOneToOne: false;
            referencedRelation: "subject_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teachers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_api_keys: {
        Row: {
          created_at: string;
          expire_at: string | null;
          id: string;
          long_token_hash: string;
          short_token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expire_at?: string | null;
          id?: string;
          long_token_hash: string;
          short_token: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expire_at?: string | null;
          id?: string;
          long_token_hash?: string;
          short_token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_api_keys_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_permissions: {
        Row: {
          created_at: string;
          id: string;
          permission_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_admin: boolean;
          lagacy_teacher_id: number | null;
          legacy_student_id: number | null;
          onboarded: boolean;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          is_admin?: boolean;
          lagacy_teacher_id?: number | null;
          legacy_student_id?: number | null;
          onboarded?: boolean;
          role: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_admin?: boolean;
          lagacy_teacher_id?: number | null;
          legacy_student_id?: number | null;
          onboarded?: boolean;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
      vaccine_records: {
        Row: {
          administering_center: string;
          created_at: string | null;
          id: string;
          legacy_id: number;
          legacy_person_id: number;
          lot_no: string;
          person_id: string | null;
          vaccination_date: string;
          vaccine_name: string;
        };
        Insert: {
          administering_center?: string;
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id: number;
          lot_no?: string;
          person_id?: string | null;
          vaccination_date: string;
          vaccine_name?: string;
        };
        Update: {
          administering_center?: string;
          created_at?: string | null;
          id?: string;
          legacy_id?: number;
          legacy_person_id?: number;
          lot_no?: string;
          person_id?: string | null;
          vaccination_date?: string;
          vaccine_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_vaccine_records_people";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      complete_elective_subjects_view: {
        Row: {
          cap_size: number | null;
          class_size: number | null;
          code_en: string | null;
          code_th: string | null;
          created_at: string | null;
          credit: number | null;
          description_en: string | null;
          description_th: string | null;
          id: string | null;
          name_en: string | null;
          name_th: string | null;
          room: string | null;
          semester: number | null;
          session_code: number | null;
          short_name_en: string | null;
          short_name_th: string | null;
          subject_group_id: number | null;
          subject_id: string | null;
          syllabus: string | null;
          type: Database["public"]["Enums"]["subject_type_en_enum"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_elective_subjects_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subjects_subject_group_id_fkey";
            columns: ["subject_group_id"];
            isOneToOne: false;
            referencedRelation: "subject_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      elective_subject_sessions_with_detail_view: {
        Row: {
          cap_size: number | null;
          class_size: number | null;
          code_en: string | null;
          code_th: string | null;
          created_at: string | null;
          credit: number | null;
          description_en: string | null;
          description_th: string | null;
          id: string | null;
          name_en: string | null;
          name_th: string | null;
          room: string | null;
          semester: number | null;
          session_code: string | null;
          short_name_en: string | null;
          short_name_th: string | null;
          subject_group_id: number | null;
          subject_id: string | null;
          syllabus: string | null;
          type: Database["public"]["Enums"]["subject_type_en_enum"] | null;
          year: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "elective_subject_sessions_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subjects_subject_group_id_fkey";
            columns: ["subject_group_id"];
            isOneToOne: false;
            referencedRelation: "subject_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      cheer_practice_attendances: {
        Row: {
          id: string;
          created_at: string | null;
          practice_period_id: string | null;
          student_id: string | null;
          checher_id: string | null;
          presence:
            | Database["public"]["Enums"]["cheer_practice_attendance_types"]
            | null;
          presence_at_end:
            | Database["public"]["Enums"]["cheer_practice_attendance_types"]
            | null;
          absence_reason: string | null;
        };
      };
    };
    Functions: {
      diesel_manage_updated_at: {
        Args: {
          _tbl: unknown;
        };
        Returns: undefined;
      };
      get_current_academic_year: {
        Args: {
          date_param: string;
        };
        Returns: number;
      };
      get_current_semester: {
        Args: {
          date: string;
        };
        Returns: number;
      };
    };
    Enums: {
      absence_type:
        | "sick"
        | "business"
        | "activity"
        | "other"
        | "late"
        | "on_leave"
        | "dropped"
        | "absent";
      activity_day_houses: "felis" | "cornicula" | "sciurus" | "cyprinus";
      attendance_event: "homeroom" | "assembly";
      blood_group: "O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+";
      certificate_type:
        | "student_of_the_year"
        | "excellent_student"
        | "academic"
        | "morale"
        | "sports"
        | "activity";
      contact_type:
        | "Phone"
        | "Email"
        | "Facebook"
        | "Line"
        | "Instagram"
        | "Website"
        | "Discord"
        | "Other";
      contact_types:
        | "phone"
        | "email"
        | "facebook"
        | "line"
        | "instagram"
        | "website"
        | "discord"
        | "other";
      cheer_practice_attendance_types:
        | "present"
        | "late"
        | "absent_with_leave"
        | "absent_without_leave"
        | "deserted";
      school_document_type:
        | "order"
        | "announcement"
        | "record"
        | "other"
        | "rules"
        | "big_garuda";
      sex: "male" | "female";
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
        | "Learner’s Development Activities"
        | "core_course"
        | "additional_course"
        | "learners_development_activities"
        | "elective";
      submission_status: "approved" | "pending" | "declined";
      user_role:
        | "student"
        | "teacher"
        | "organization"
        | "staff"
        | "management";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
