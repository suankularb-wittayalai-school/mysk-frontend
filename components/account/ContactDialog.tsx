// Imports
import ContactCard from "@/components/account/ContactCard";
import useForm from "@/utils/helpers/useForm";
import { DialogFC } from "@/utils/types/component";
import { Contact, ContactType } from "@/utils/types/contact";
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
import { useTranslation } from "next-i18next";
import { ComponentProps, useEffect, useReducer } from "react";

const ContactDialog: DialogFC<{
  contact?: Contact;
  onSubmit: (contact: Contact) => void;
}> = ({ open, contact, onClose, onSubmit }) => {
  const { t } = useTranslation("account");

  const contactValuesMap: {
    [key in ContactType]: {
      type: ComponentProps<"input">["type"];
      helperMsg?: string;
      validate?: (value: string) => boolean;
    };
  } = {
    phone: {
      type: "tel",
      validate: (value) => /^\d{9,10}$/.test(value),
    },
    email: { type: "email" },
    website: { type: "url" },
    facebook: { type: "text" },
    line: { type: "text" },
    instagram: {
      type: "text",
      validate: (value) => /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/i.test(value),
    },
    discord: {
      type: "text",
      validate: (value) => /^([a-zA-Z0-9]{8}|.{3,32}#[0-9]{4})$/.test(value),
    },
    other: { type: "text" },
  };

  const [counter, incrementCounter] = useReducer((counter) => counter + 1, 1);
  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "nameTH" | "nameEN" | "type" | "value"
  >([
    { key: "nameTH", defaultValue: contact?.name?.th },
    { key: "nameEN", defaultValue: contact?.name?.["en-US"] },
    { key: "type", required: true, defaultValue: contact?.type || "phone" },
    { key: "value", required: true, defaultValue: contact?.value },
  ]);

  // Format group invite codes from invite links for Discord
  useEffect(() => {
    if (form.type === "discord")
      setForm({
        ...form,
        value: (form.value as string).split("https://discord.gg/").join(""),
      });
  }, [form.value, form.type]);

  /**
   * Pass the form data onto `onSubmit`.
   */
  function handleSubmit() {
    if (
      !(
        // Check for form completion
        (
          formOK &&
          // Check if value is valid
          (contactValuesMap[form.type as ContactType].validate
            ? contactValuesMap[form.type as ContactType].validate!(form.value)
            : true)
        )
      )
    )
      return;
    onSubmit({
      id: contact?.id || counter,
      name: form.nameTH ? { th: form.nameTH, "en-US": form.nameEN } : null,
      type: form.type,
      value: form.value,
      include_students: null,
      include_teachers: null,
      include_parents: null,
    });
    resetForm();
    if (!contact) incrementCounter();
  }

  return (
    <Dialog open={open} width={580} onClose={onClose}>
      <DialogHeader
        title={t(`dialog.contact.title.${contact ? "edit" : "add"}`)}
        desc={t("dialog.contact.desc")}
      />
      <DialogContent className="px-6">
        <Columns columns={2} className="!gap-y-8">
          {formOK && (
            <>
              <ContactCard
                contact={{
                  id: counter,
                  name: form.nameTH
                    ? { th: form.nameTH, "en-US": form.nameEN }
                    : null,
                  type: form.type as ContactType,
                  value: form.value,
                  include_students: null,
                  include_teachers: null,
                  include_parents: null,
                }}
              />
              <div aria-hidden className="hidden sm:block" />
            </>
          )}

          {/* Type */}
          <Select
            appearance="outlined"
            label={t("dialog.contact.type.label")}
            {...formProps.type}
          >
            <MenuItem value="phone">{t("dialog.contact.type.phone")}</MenuItem>
            <MenuItem value="email">{t("dialog.contact.type.email")}</MenuItem>
            <MenuItem value="facebook">
              {t("dialog.contact.type.facebook")}
            </MenuItem>
            <MenuItem value="line">{t("dialog.contact.type.line")}</MenuItem>
            <MenuItem value="instagram">
              {t("dialog.contact.type.instagram")}
            </MenuItem>
            <MenuItem value="website">
              {t("dialog.contact.type.website")}
            </MenuItem>
            <MenuItem value="discord">
              {t("dialog.contact.type.discord")}
            </MenuItem>
            <MenuItem value="other">{t("dialog.contact.type.other")}</MenuItem>
          </Select>

          {/* Value */}
          <TextField
            appearance="outlined"
            label={t(`dialog.contact.value.${form.type.toLowerCase()}`)}
            helperMsg={contactValuesMap[form.type as ContactType].helperMsg}
            inputAttr={{
              type: contactValuesMap[form.type as ContactType].type,
            }}
            {...formProps.value}
            error={
              form.value && contactValuesMap[form.type as ContactType].validate
                ? !contactValuesMap[form.type as ContactType].validate!(
                    form.value,
                  )
                : false
            }
          />

          {/* Label */}
          <TextField
            appearance="outlined"
            label={t("dialog.contact.nameTH")}
            helperMsg={t("dialog.contact.name_helper")}
            {...formProps.nameTH}
          />
          <TextField
            appearance="outlined"
            label={t("dialog.contact.nameEN")}
            helperMsg={t("dialog.contact.name_helper")}
            {...formProps.nameEN}
          />
        </Columns>
      </DialogContent>
      <Actions>
        {/* Cancel */}
        <Button appearance="text" onClick={onClose}>
          {t("dialog.contact.action.cancel")}
        </Button>

        {/* Save */}
        <Button appearance="text" onClick={handleSubmit}>
          {t(`dialog.contact.action.${contact ? "save" : "add"}`)}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ContactDialog;
