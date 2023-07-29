export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      classroom_advisors: {
        Row: {
          classroom_id: string
          created_at: string | null
          id: string
          teacher_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string | null
          id?: string
          teacher_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string | null
          id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_advisors_classroom_id_fkey"
            columns: ["classroom_id"]
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_advisors_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      classroom_contacts: {
        Row: {
          classroom_id: string
          contact_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          classroom_id: string
          contact_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          classroom_id?: string
          contact_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_contacts_classroom_id_fkey"
            columns: ["classroom_id"]
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_contacts_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          }
        ]
      }
      classroom_students: {
        Row: {
          class_no: number
          classroom_id: string
          created_at: string | null
          id: number
          student_id: string
        }
        Insert: {
          class_no: number
          classroom_id: string
          created_at?: string | null
          id?: number
          student_id: string
        }
        Update: {
          class_no?: number
          classroom_id?: string
          created_at?: string | null
          id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_students_classroom_id_fkey"
            columns: ["classroom_id"]
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_students_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      classroom_subject_co_teachers: {
        Row: {
          classroom_subject_id: string
          created_at: string | null
          id: string
          teacher_id: string
        }
        Insert: {
          classroom_subject_id: string
          created_at?: string | null
          id?: string
          teacher_id: string
        }
        Update: {
          classroom_subject_id?: string
          created_at?: string | null
          id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_subject_co_teachers_classroom_subject_id_fkey"
            columns: ["classroom_subject_id"]
            referencedRelation: "classroom_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_subject_co_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      classroom_subject_teachers: {
        Row: {
          classroom_subject_id: string
          created_at: string | null
          id: string
          teacher_id: string
        }
        Insert: {
          classroom_subject_id: string
          created_at?: string | null
          id?: string
          teacher_id: string
        }
        Update: {
          classroom_subject_id?: string
          created_at?: string | null
          id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_subject_teachers_classroom_subject_id_fkey"
            columns: ["classroom_subject_id"]
            referencedRelation: "classroom_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_subject_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      classroom_subjects: {
        Row: {
          classroom_id: string | null
          created_at: string | null
          gg_meet_link: string | null
          ggc_code: string | null
          ggc_link: string | null
          id: string
          legacy_classroom_id: number
          legacy_id: number
          legacy_subject_id: number
          semester: number
          subject_id: string | null
          year: number
        }
        Insert: {
          classroom_id?: string | null
          created_at?: string | null
          gg_meet_link?: string | null
          ggc_code?: string | null
          ggc_link?: string | null
          id?: string
          legacy_classroom_id: number
          legacy_id?: number
          legacy_subject_id: number
          semester?: number
          subject_id?: string | null
          year?: number
        }
        Update: {
          classroom_id?: string | null
          created_at?: string | null
          gg_meet_link?: string | null
          ggc_code?: string | null
          ggc_link?: string | null
          id?: string
          legacy_classroom_id?: number
          legacy_id?: number
          legacy_subject_id?: number
          semester?: number
          subject_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "classroom_subjects_classroom_id_fkey"
            columns: ["classroom_id"]
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_subjects_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      classrooms: {
        Row: {
          created_at: string | null
          id: string
          legacy_id: number
          number: number
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          number: number
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          number?: number
          year?: number
        }
        Relationships: []
      }
      club_contacts: {
        Row: {
          club_id: string
          contact_id: string | null
          created_at: string | null
          id: string
          legacy_contact_id: number
        }
        Insert: {
          club_id: string
          contact_id?: string | null
          created_at?: string | null
          id?: string
          legacy_contact_id: number
        }
        Update: {
          club_id?: string
          contact_id?: string | null
          created_at?: string | null
          id?: string
          legacy_contact_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_contacts_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_club_contacts_classrooms"
            columns: ["contact_id"]
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          }
        ]
      }
      club_members: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          legacy_student_id: number
          membership_status: Database["public"]["Enums"]["submission_status"]
          student_id: string | null
          year: number
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          legacy_student_id: number
          membership_status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string | null
          year: number
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          legacy_student_id?: number
          membership_status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_members"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          }
        ]
      }
      club_staffs: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          legacy_student_id: number
          position: string | null
          student_id: string | null
          year: number
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          legacy_student_id: number
          position?: string | null
          student_id?: string | null
          year: number
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          legacy_student_id?: number
          position?: string | null
          student_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_staffs"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_staffs_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          }
        ]
      }
      clubs: {
        Row: {
          accent_color: string | null
          background_color: string | null
          created_at: string | null
          house: Database["public"]["Enums"]["activity_day_houses"] | null
          id: string
          map_location: number | null
          organization_id: string
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string | null
          house?: Database["public"]["Enums"]["activity_day_houses"] | null
          id?: string
          map_location?: number | null
          organization_id: string
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string | null
          house?: Database["public"]["Enums"]["activity_day_houses"] | null
          id?: string
          map_location?: number | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          id: string
          include_parents: boolean | null
          include_students: boolean | null
          include_teachers: boolean | null
          legacy_id: number
          name_en: string | null
          name_th: string | null
          type: Database["public"]["Enums"]["contact_types"]
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          include_parents?: boolean | null
          include_students?: boolean | null
          include_teachers?: boolean | null
          legacy_id?: number
          name_en?: string | null
          name_th?: string | null
          type: Database["public"]["Enums"]["contact_types"]
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          include_parents?: boolean | null
          include_students?: boolean | null
          include_teachers?: boolean | null
          legacy_id?: number
          name_en?: string | null
          name_th?: string | null
          type?: Database["public"]["Enums"]["contact_types"]
          value?: string
        }
        Relationships: []
      }
      infos: {
        Row: {
          body_en: string
          body_th: string
          created_at: string
          id: string
          legacy_id: number
          legacy_news_id: number
          news_id: string | null
        }
        Insert: {
          body_en: string
          body_th: string
          created_at?: string
          id?: string
          legacy_id?: number
          legacy_news_id: number
          news_id?: string | null
        }
        Update: {
          body_en?: string
          body_th?: string
          created_at?: string
          id?: string
          legacy_id?: number
          legacy_news_id?: number
          news_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_infos_news"
            columns: ["news_id"]
            referencedRelation: "news"
            referencedColumns: ["id"]
          }
        ]
      }
      news: {
        Row: {
          created_at: string
          description_en: string | null
          description_th: string
          id: string
          image: string | null
          legacy_id: number
          old_url: string | null
          title_en: string | null
          title_th: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_th?: string
          id?: string
          image?: string | null
          legacy_id?: number
          old_url?: string | null
          title_en?: string | null
          title_th?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_th?: string
          id?: string
          image?: string | null
          legacy_id?: number
          old_url?: string | null
          title_en?: string | null
          title_th?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_th: string | null
          id: string
          logo_url: string | null
          main_room: string | null
          name_en: string | null
          name_th: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          logo_url?: string | null
          main_room?: string | null
          name_en?: string | null
          name_th: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          logo_url?: string | null
          main_room?: string | null
          name_en?: string | null
          name_th?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      people: {
        Row: {
          birthdate: string
          citizen_id: string
          created_at: string | null
          first_name_en: string | null
          first_name_th: string
          id: string
          last_name_en: string | null
          last_name_th: string
          legacy_id: number
          middle_name_en: string | null
          middle_name_th: string | null
          nickname_en: string | null
          nickname_th: string | null
          pants_size: string | null
          prefix_en: string | null
          prefix_th: string
          profile: string | null
          shirt_size: Database["public"]["Enums"]["shirt_size"] | null
        }
        Insert: {
          birthdate: string
          citizen_id: string
          created_at?: string | null
          first_name_en?: string | null
          first_name_th: string
          id?: string
          last_name_en?: string | null
          last_name_th: string
          legacy_id?: number
          middle_name_en?: string | null
          middle_name_th?: string | null
          nickname_en?: string | null
          nickname_th?: string | null
          pants_size?: string | null
          prefix_en?: string | null
          prefix_th: string
          profile?: string | null
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null
        }
        Update: {
          birthdate?: string
          citizen_id?: string
          created_at?: string | null
          first_name_en?: string | null
          first_name_th?: string
          id?: string
          last_name_en?: string | null
          last_name_th?: string
          legacy_id?: number
          middle_name_en?: string | null
          middle_name_th?: string | null
          nickname_en?: string | null
          nickname_th?: string | null
          pants_size?: string | null
          prefix_en?: string | null
          prefix_th?: string
          profile?: string | null
          shirt_size?: Database["public"]["Enums"]["shirt_size"] | null
        }
        Relationships: []
      }
      person_allergies: {
        Row: {
          allergy_name: string
          created_at: string | null
          id: string
          legacy_id: number
          legacy_person_id: number
          person_id: string | null
        }
        Insert: {
          allergy_name: string
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id: number
          person_id?: string | null
        }
        Update: {
          allergy_name?: string
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id?: number
          person_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_allergies_person_id_fkey"
            columns: ["person_id"]
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
      person_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          person_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          person_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_contacts_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_contacts_person_id_fkey"
            columns: ["person_id"]
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_item_classroom_subjects: {
        Row: {
          classroom_subject_id: string
          created_at: string | null
          id: string
          schedule_item_id: string
        }
        Insert: {
          classroom_subject_id: string
          created_at?: string | null
          id?: string
          schedule_item_id: string
        }
        Update: {
          classroom_subject_id?: string
          created_at?: string | null
          id?: string
          schedule_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_item_classroom_subjects_classroom_subject_id_fkey"
            columns: ["classroom_subject_id"]
            referencedRelation: "classroom_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_item_classroom_subjects_schedule_item_id_fkey"
            columns: ["schedule_item_id"]
            referencedRelation: "schedule_items"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_item_classrooms: {
        Row: {
          classroom_id: string
          created_at: string | null
          id: string
          schedule_item_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string | null
          id?: string
          schedule_item_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string | null
          id?: string
          schedule_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_item_classrooms_classroom_id_fkey"
            columns: ["classroom_id"]
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_item_classrooms_schedule_item_id_fkey"
            columns: ["schedule_item_id"]
            referencedRelation: "schedule_items"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_item_rooms: {
        Row: {
          created_at: string | null
          id: string
          room: string
          schedule_item_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          room: string
          schedule_item_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          room?: string
          schedule_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_item_rooms_schedule_item_id_fkey"
            columns: ["schedule_item_id"]
            referencedRelation: "schedule_items"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_item_teachers: {
        Row: {
          created_at: string | null
          id: string
          schedule_item_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          schedule_item_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          schedule_item_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_item_teachers_schedule_item_id_fkey"
            columns: ["schedule_item_id"]
            referencedRelation: "schedule_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_item_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule_items: {
        Row: {
          created_at: string | null
          day: number | null
          duration: number
          id: string
          legacy_classroom_id: number
          legacy_id: number
          legacy_subject_id: number
          semester: number
          start_time: number
          subject_id: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          day?: number | null
          duration: number
          id?: string
          legacy_classroom_id: number
          legacy_id?: number
          legacy_subject_id: number
          semester: number
          start_time: number
          subject_id?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          day?: number | null
          duration?: number
          id?: string
          legacy_classroom_id?: number
          legacy_id?: number
          legacy_subject_id?: number
          semester?: number
          start_time?: number
          subject_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      school_documents: {
        Row: {
          attend_to: string | null
          code: string
          created_at: string | null
          date: string
          document_link: string
          id: string
          include_parents: boolean | null
          include_students: boolean | null
          include_teachers: boolean | null
          legacy_id: number
          subject: string
          type: string
        }
        Insert: {
          attend_to?: string | null
          code?: string
          created_at?: string | null
          date: string
          document_link?: string
          id?: string
          include_parents?: boolean | null
          include_students?: boolean | null
          include_teachers?: boolean | null
          legacy_id?: number
          subject?: string
          type: string
        }
        Update: {
          attend_to?: string | null
          code?: string
          created_at?: string | null
          date?: string
          document_link?: string
          id?: string
          include_parents?: boolean | null
          include_students?: boolean | null
          include_teachers?: boolean | null
          legacy_id?: number
          subject?: string
          type?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string | null
          id: string
          legacy_id: number
          legacy_person_id: number
          person_id: string | null
          student_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id: number
          person_id?: string | null
          student_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id?: number
          person_id?: string | null
          student_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_person_id_fkey"
            columns: ["person_id"]
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_users_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subject_co_teachers: {
        Row: {
          created_at: string | null
          id: string
          subject_id: string
          teacher_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          subject_id: string
          teacher_id: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          subject_id?: string
          teacher_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "subject_co_teachers_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_co_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      subject_groups: {
        Row: {
          created_at: string | null
          id: number
          name_en: string
          name_th: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name_en: string
          name_th: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name_en?: string
          name_th?: string
        }
        Relationships: []
      }
      subject_teachers: {
        Row: {
          created_at: string | null
          id: string
          subject_id: string
          teacher_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          subject_id: string
          teacher_id: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          subject_id?: string
          teacher_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "subject_teachers_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      subjects: {
        Row: {
          code_en: string
          code_th: string
          created_at: string | null
          credit: number
          description_en: string | null
          description_th: string | null
          id: string
          legacy_id: number
          name_en: string
          name_th: string
          semester: number
          short_name_en: string | null
          short_name_th: string | null
          subject_group_id: number
          syllabus: string | null
          type: Database["public"]["Enums"]["subject_type_en_enum"]
        }
        Insert: {
          code_en: string
          code_th: string
          created_at?: string | null
          credit: number
          description_en?: string | null
          description_th?: string | null
          id?: string
          legacy_id?: number
          name_en: string
          name_th: string
          semester: number
          short_name_en?: string | null
          short_name_th?: string | null
          subject_group_id: number
          syllabus?: string | null
          type: Database["public"]["Enums"]["subject_type_en_enum"]
        }
        Update: {
          code_en?: string
          code_th?: string
          created_at?: string | null
          credit?: number
          description_en?: string | null
          description_th?: string | null
          id?: string
          legacy_id?: number
          name_en?: string
          name_th?: string
          semester?: number
          short_name_en?: string | null
          short_name_th?: string | null
          subject_group_id?: number
          syllabus?: string | null
          type?: Database["public"]["Enums"]["subject_type_en_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "subjects_subject_group_id_fkey"
            columns: ["subject_group_id"]
            referencedRelation: "subject_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          id: string
          legacy_id: number
          legacy_person_id: number
          person_id: string | null
          subject_group_id: number
          teacher_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id: number
          person_id?: string | null
          subject_group_id: number
          teacher_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id?: number
          person_id?: string | null
          subject_group_id?: number
          teacher_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_teachers_people"
            columns: ["person_id"]
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_subject_group_id_fkey"
            columns: ["subject_group_id"]
            referencedRelation: "subject_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_users_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          is_admin: boolean
          lagacy_teacher_id: number | null
          legacy_student_id: number | null
          onboarded: boolean
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          email?: string | null
          id: string
          is_admin?: boolean
          lagacy_teacher_id?: number | null
          legacy_student_id?: number | null
          onboarded?: boolean
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          email?: string | null
          id?: string
          is_admin?: boolean
          lagacy_teacher_id?: number | null
          legacy_student_id?: number | null
          onboarded?: boolean
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      vaccine_records: {
        Row: {
          administering_center: string
          created_at: string | null
          id: string
          legacy_id: number
          legacy_person_id: number
          lot_no: string
          person_id: string | null
          vaccination_date: string
          vaccine_name: string
        }
        Insert: {
          administering_center?: string
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id: number
          lot_no?: string
          person_id?: string | null
          vaccination_date: string
          vaccine_name?: string
        }
        Update: {
          administering_center?: string
          created_at?: string | null
          id?: string
          legacy_id?: number
          legacy_person_id?: number
          lot_no?: string
          person_id?: string | null
          vaccination_date?: string
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vaccine_records_people"
            columns: ["person_id"]
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      diesel_manage_updated_at: {
        Args: {
          _tbl: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      activity_day_houses: "felis" | "cornicula" | "sciurus" | "cyprinus"
      blood_group: "O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+"
      contact_type:
        | "Phone"
        | "Email"
        | "Facebook"
        | "Line"
        | "Instagram"
        | "Website"
        | "Discord"
        | "Other"
      contact_types:
        | "phone"
        | "email"
        | "facebook"
        | "line"
        | "instagram"
        | "website"
        | "discord"
        | "other"
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
        | "6XL"
      subject_type_en_enum:
        | "Core Courses"
        | "Elective Courses"
        | "Additional Courses"
        | "Learner’s Development Activities"
        | "core_course"
        | "additional_course"
        | "learners_development_activities"
      submission_status: "approved" | "pending" | "declined"
      user_role: "student" | "teacher" | "organization" | "staff" | "management"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
