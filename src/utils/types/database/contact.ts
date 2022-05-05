export interface ContactDB {
  id: number;
  type:
    | "Phone"
    | "Email"
    | "Facebook"
    | "Line"
    | "Instagram"
    | "Website"
    | "Discord"
    | "Other";
  name_en?: string;
  name_th: string;
  value: string;
  include_students?: boolean;
  include_parents?: boolean;
  include_teachers?: boolean;
}
