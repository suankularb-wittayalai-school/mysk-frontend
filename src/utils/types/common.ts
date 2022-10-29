import { PostgrestError } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/react-table";

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

export interface DialogProps {
  show: boolean;
  onClose: () => void;
}

export interface SubmittableDialogProps extends DialogProps {
  onSubmit: () => void;
}

export type BackendReturn<T, U = []> =
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
export type SubmittableDialogComponent<T = {}> = (
  props: T & SubmittableDialogProps
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
