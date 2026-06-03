import { MultiLangString } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { Contact } from "@/utils/types/contact";
import { Classroom } from "@/utils/types/classroom";

export type PageScheme = "light" | "dark";

export type CalculatedClubScheme = { page: PageScheme; button: PageScheme };

/**
 * A generic school organization.
 */
export type Organization = {
  id: string;
  name: MultiLangString;
  description?: MultiLangString;
};

/**
 * A school Club with configurations for the Join pages; a superset of
 * Organization.
 */
export type Club = Organization & {
  logo_url?: string;
  background_color?: string;
  member_count: number;
  contacts: Contact[];
  accent_color?: string;
  staff_count: number;
  members: Student[];
  staffs: Student[];
};

/**
 * A request to join a club.
 */
export type ClubJoinRequest = {
  id: string;
  created_at?: string;
  club: Club;
  student: Student;
  year: number;
  membership_status: "pending" | "approved" | "declined";
};

/**
 * Statistics to show in the Cool Statistics Section.
 */
export type ClubStatistics = {
  count: number;
  byClass: {
    class: Pick<Classroom, "number" | "id">;
    count: number;
  }[];
};
