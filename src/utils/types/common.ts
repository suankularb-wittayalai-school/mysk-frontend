import { PostgrestError } from "@supabase/supabase-js";

export type LangCode = "th" | "en-US";

export type MultiLangString = {
  th: string;
  "en-US"?: string;
};

export type MultiLangObj = {
  th: {};
  "en-US"?: {};
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
