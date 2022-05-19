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
