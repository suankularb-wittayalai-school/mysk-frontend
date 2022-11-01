import { PostgrestError } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";
import { Database } from "./supabase";

export type OrUndefined<T> = T | undefined;

export type LangCode = "th" | "en-US";

export type MultiLangString = {
  th: string;
  "en-US"?: string;
};

export type MultiLangObj<T = object> = {
  th: T;
  "en-US"?: T;
};

export type ForcedMultiLangString = {
  th: string;
  "en-US": string;
};

export type DialogProps = {
  show: boolean;
  onClose: () => void;
};

export type SubmittableDialogProps<T = () => void> = DialogProps & {
  onSubmit: T;
};

export type BackendReturn = { error: Partial<PostgrestError> | null };

export type BackendDataReturn<T, U = []> =
  | { data: T; error: null }
  | { data: U; error: Partial<PostgrestError> };

export type DataTableColumnDef = ColumnDef<object> &
  Partial<{
    thClass: string;
    tdClass: string;
    render: (row: any) => JSX.Element;
    noDataMsg: string | JSX.Element;
  }>;

export type DialogComponent<T = {}> = (props: T & DialogProps) => JSX.Element;
export type SubmittableDialogComponent<T = () => void, U = {}> = (
  props: U & SubmittableDialogProps<T>
) => JSX.Element;

export type ChipInputListItem = {
  id: string;
  name: string;
};

export type WaitingSnackbar = {
  id: string;
  text: string;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined;
  isStacked?: boolean | undefined;
};
