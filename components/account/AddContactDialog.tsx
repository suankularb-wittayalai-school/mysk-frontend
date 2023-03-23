// External libraries
import { useTranslation } from "next-i18next";
import { useEffect, useReducer } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  MenuItem,
  Select,
  TextField,
} from "@suankularb-components/react";

// Hooks
import { useForm } from "@/utils/hooks/form";

// Types
import {
  MultiLangString,
  SubmittableDialogComponent,
} from "@/utils/types/common";
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
      label: MultiLangString;
    };
  } = {
    Phone: {
      type: "tel",
      validate: (value) => /\d{9,10}/.test(value),
      label: { "en-US": "Telephone", th: "เบอร์โทรศัพท์" },
    },
    Email: { type: "email", label: { "en-US": "Email", th: "อีเมล" } },
    Website: { type: "url", label: { "en-US": "Website", th: "เว็บไซต์" } },
    Facebook: { type: "text", label: { "en-US": "Facebook", th: "Facebook" } },
    Line: {
      type: "text",
      validate: (value) => value.length === 10,
      helperMsg: t("dialog.addContact.value.line_helper"),
      label: { "en-US": "LINE", th: "LINE" },
    },
    Instagram: {
      type: "text",
      validate: (value) => /(?:(?:[\\w][\\.]{0,1})*[\\w]){1,29}/.test(value),
      label: { "en-US": "Instagram", th: "Instagram" },
    },
    Discord: {
      type: "text",
      validate: (value) => /[a-zA-Z0-9]{8}/.test(value),
      helperMsg: t("dialog.addContact.value.discord_helper"),
      label: { "en-US": "Discord", th: "Discord" },
    },
    Other: { type: "text", label: { "en-US": "", th: "" } },
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
        title={t("dialog.addContact.title")}
        desc={t("dialog.addContact.desc")}
      />
      <DialogContent className="px-6">
        <Columns columns={2} className="!gap-y-8">
          <Select
            appearance="outlined"
            label={t("dialog.addContact.type.label")}
            {...formProps.type}
          >
            <MenuItem value="Phone">
              {t("dialog.addContact.type.phone")}
            </MenuItem>
            <MenuItem value="Email">
              {t("dialog.addContact.type.email")}
            </MenuItem>
            <MenuItem value="Facebook">
              {t("dialog.addContact.type.facebook")}
            </MenuItem>
            <MenuItem value="Line">{t("dialog.addContact.type.line")}</MenuItem>
            <MenuItem value="Instagram">
              {t("dialog.addContact.type.instagram")}
            </MenuItem>
            <MenuItem value="Website">
              {t("dialog.addContact.type.website")}
            </MenuItem>
            <MenuItem value="Discord">
              {t("dialog.addContact.type.discord")}
            </MenuItem>
            <MenuItem value="Other">
              {t("dialog.addContact.type.other")}
            </MenuItem>
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
          {t("dialog.addContact.action.cancel")}
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
          {t("dialog.addContact.action.add")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AddContactDialog;
