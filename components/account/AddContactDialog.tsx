// External libraries
import { useTranslation } from "next-i18next";
import { useReducer } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  Dialog,
  DialogContent,
  DialogHeader,
  MenuItem,
  Select,
  TextField,
} from "@suankularb-components/react";

// Hooks
import { useForm } from "@/utils/hooks/form";

// Types
import { SubmittableDialogComponent } from "@/utils/types/common";
import { Contact, ContactVia } from "@/utils/types/contact";

const AddContactDialog: SubmittableDialogComponent<
  (contact: Contact) => void
> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("account");

  const contactValuesMap: {
    [key in ContactVia]: {
      type: "number" | "tel" | "email" | "url" | "text";
      validate?: (value: string) => boolean;
      helperMsg?: string;
    };
  } = {
    Phone: {
      type: "tel",
      validate: (value) => /\d{9,10}/.test(value),
    },
    Email: { type: "email" },
    Website: { type: "url" },
    Facebook: { type: "text" },
    Line: {
      type: "text",
      validate: (value) => value.length === 10,
      helperMsg: t("dialog.addContact.value.line_helper"),
    },
    Instagram: {
      type: "text",
      validate: (value) => /(?:(?:[\\w][\\.]{0,1})*[\\w]){1,29}/.test(value),
    },
    Discord: {
      type: "text",
      validate: (value) => /[a-zA-Z0-9]{8}/.test(value),
      helperMsg: t("dialog.addContact.value.discord_helper"),
    },
    Other: { type: "text" },
  };

  const [counter, incrementCounter] = useReducer((counter) => counter + 1, 1);
  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "nameTH" | "nameEN" | "type" | "value"
  >([
    { key: "nameTH", required: true },
    { key: "nameEN" },
    { key: "type", required: true, defaultValue: "Phone" },
    { key: "value", required: true },
  ]);

  return (
    <Dialog open={open} width={580} onClose={onClose}>
      <DialogHeader
        title="Add a contact"
        desc="A contact is a way people can reach you. Everyone inside the
          school can find your contact information via MySK Lookup."
      />
      <DialogContent className="px-6">
        <Columns columns={2} className="!gap-y-8">
          <Select
            appearance="outlined"
            label={t("dialog.addContact.type")}
            {...formProps.type}
          >
            <MenuItem value="Phone">Phone</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Facebook">Facebook</MenuItem>
            <MenuItem value="Line">Line</MenuItem>
            <MenuItem value="Instagram">Instagram</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Discord">Discord</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField
            appearance="outlined"
            label={t(`dialog.addContact.value.${form.type.toLowerCase()}`)}
            helperMsg={contactValuesMap[form.type as ContactVia].helperMsg}
            inputAttr={{ type: contactValuesMap[form.type as ContactVia].type }}
            {...formProps.value}
          />
          <TextField
            appearance="outlined"
            label={t("dialog.addContact.nameTH")}
            {...formProps.nameTH}
          />
          <TextField
            appearance="outlined"
            label={t("dialog.addContact.nameEN")}
            {...formProps.nameEN}
          />
        </Columns>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          appearance="text"
          onClick={() => {
            if (!formOK) return;
            onSubmit({
              id: counter,
              name: { th: form.nameTH, "en-US": form.nameEN },
              type: form.type as ContactVia,
              value: form.value,
            });
            resetForm();
            incrementCounter();
          }}
        >
          Add
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AddContactDialog;
