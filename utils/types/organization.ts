import { MultiLangString } from "@/utils/types/common";

export type Organization = {
  id: string;
  name: MultiLangString;
  description: MultiLangString;
  logo_url: string;
  main_room: string; // TODO: Change to Room type later when we have the data
  rooms: string[]; // TODO: Change to Room type later when we have the data
};
