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

export type ChipInputListItem = {
  id: string;
  name: string;
};
