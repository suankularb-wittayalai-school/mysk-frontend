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

const ContactDialog: SubmittableDialogComponent<
  (contact: Contact) => void,
  { contact?: Contact }
> = ({ open, contact, onClose, onSubmit }) => {
  const { t } = useTranslation("account");

  const contactValuesMap: {
    [key in ContactVia]: {
      type: "number" | "tel" | "email" | "url" | "text";
      helperMsg?: string;
      validate?: (value: string) => boolean;
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
      helperMsg: t("dialog.contact.value.line_helper"),
      validate: (value) => value.length === 10,
    },
    Instagram: {
      type: "text",
      validate: (value) => /(?:(?:[\\w][\\.]{0,1})*[\\w]){1,29}/.test(value),
    },
    Discord: {
      type: "text",
      helperMsg: t("dialog.contact.value.discord_helper"),
      validate: (value) => /[a-zA-Z0-9]{8}/.test(value),
    },
    Other: { type: "text" },
  };

  const [counter, incrementCounter] = useReducer((counter) => counter + 1, 1);
  const { form, resetForm, formOK, formProps } = useForm<
    "nameTH" | "nameEN" | "type" | "value"
  >([
    { key: "nameTH", defaultValue: contact?.name?.th },
    { key: "nameEN", defaultValue: contact?.name?.["en-US"] },
    { key: "type", required: true, defaultValue: contact?.type || "Phone" },
    { key: "value", required: true, defaultValue: contact?.value },
  ]);

  return (
    <Dialog open={open} width={580} onClose={onClose}>
      <DialogHeader
        title={t(`dialog.contact.title.${contact ? "edit" : "add"}`)}
        desc={t("dialog.contact.desc")}
      />
      <DialogContent className="px-6">
        <Columns columns={2} className="!gap-y-8">
          {/* Type */}
          <Select
            appearance="outlined"
            label={t("dialog.contact.type.label")}
            {...formProps.type}
          >
            <MenuItem value="Phone">{t("dialog.contact.type.phone")}</MenuItem>
            <MenuItem value="Email">{t("dialog.contact.type.email")}</MenuItem>
            <MenuItem value="Facebook">
              {t("dialog.contact.type.facebook")}
            </MenuItem>
            <MenuItem value="Line">{t("dialog.contact.type.line")}</MenuItem>
            <MenuItem value="Instagram">
              {t("dialog.contact.type.instagram")}
            </MenuItem>
            <MenuItem value="Website">
              {t("dialog.contact.type.website")}
            </MenuItem>
            <MenuItem value="Discord">
              {t("dialog.contact.type.discord")}
            </MenuItem>
            <MenuItem value="Other">{t("dialog.contact.type.other")}</MenuItem>
          </Select>

          {/* Value */}
          <TextField
            appearance="outlined"
            label={t(`dialog.contact.value.${form.type.toLowerCase()}`)}
            helperMsg={contactValuesMap[form.type as ContactVia].helperMsg}
            inputAttr={{ type: contactValuesMap[form.type as ContactVia].type }}
            {...formProps.value}
          />

          {/* Label */}
          <TextField
            appearance="outlined"
            label={t("dialog.contact.nameTH")}
            {...formProps.nameTH}
          />
          <TextField
            appearance="outlined"
            label={t("dialog.contact.nameEN")}
            {...formProps.nameEN}
          />
        </Columns>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("dialog.contact.action.cancel")}
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
          {t(`dialog.contact.action.${contact ? "save" : "add"}`)}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ContactDialog;
