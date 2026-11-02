import { MultiLangString } from "@/utils/types/common";
import { ShirtSize } from "@/utils/types/person";

/**
 * A Person from the MySK API.
 */
export type APIPerson = {
  id: string;
  prefix: MultiLangString;
  first_name: MultiLangString;
  last_name: MultiLangString;
  middle_name: MultiLangString | null;
  nickname: MultiLangString | null;
  birthdate: string | null;
  allergies: string[];
  shirt_size: ShirtSize | null;
  pants_size: string | null;
  profile?: string | null;
};

/**
 * A Student from the MySK API.
 */
export type APIStudent = {
  id: string;
  student_id: string | null;
  class_no: number | null;
  classroom: {
    id: string;
    number: number;
  } | null;
  person: APIPerson;
};
