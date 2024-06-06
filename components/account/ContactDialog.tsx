import ContactCard from "@/components/account/ContactCard";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import { Contact, ContactType } from "@/utils/types/contact";
import {
  Actions,
  Button,
  Columns,
  Dialog,
  DialogContent,
  DialogHeader,
  Divider,
  MenuItem,
  Select,
  TextField,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { ComponentProps, useReducer } from "react";

const ContactDialog: StylableFC<{
  open?: boolean;
  contact?: Contact;
  onClose: () => void;
  onSubmit: (contact: Contact) => void;
}> = ({ open, contact, onClose, onSubmit }) => {
  const { t } = useTranslation("account/contacts/contactDialog");

  /**
   * Map of Contact types to their respective Text Field props.
   */
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
    discord: { type: "text" },
    other: { type: "text" },
  };

  const [counter, incrementCounter] = useReducer((counter) => counter + 1, 1);
  const { form, resetForm, formOK, formProps } = useForm<
    "nameTH" | "nameEN" | "type" | "value"
  >([
    { key: "nameTH", defaultValue: contact?.name?.th },
    { key: "nameEN", defaultValue: contact?.name?.["en-US"] },
    { key: "type", required: true, defaultValue: contact?.type || "phone" },
    { key: "value", required: true, defaultValue: contact?.value },
  ]);

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
        title={t(`title.${contact ? "edit" : "add"}`)}
        desc={t("account/contacts:desc")}
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
            label={t("form.type")}
            {...formProps.type}
          >
            <MenuItem value="phone">{t("common:contact.phone")}</MenuItem>
            <MenuItem value="email">{t("common:contact.email")}</MenuItem>
            <MenuItem value="facebook">{t("common:contact.facebook")}</MenuItem>
            <MenuItem value="line">{t("common:contact.line")}</MenuItem>
            <MenuItem value="instagram">
              {t("common:contact.instagram")}
            </MenuItem>
            <MenuItem value="website">{t("common:contact.website")}</MenuItem>
            <MenuItem value="discord">{t("common:contact.discord")}</MenuItem>
            <Divider className="my-2" />
            <MenuItem value="other">{t("common:contact.other")}</MenuItem>
          </Select>

          {/* Value */}
          <TextField
            appearance="outlined"
            label={t(`form.value.${form.type.toLowerCase()}`)}
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
            label={t("form.nameTH")}
            helperMsg={t("form.name_helper")}
            {...formProps.nameTH}
          />
          <TextField
            appearance="outlined"
            label={t("form.nameEN")}
            helperMsg={t("form.name_helper")}
            {...formProps.nameEN}
          />
        </Columns>
      </DialogContent>
      <Actions>
        {/* Cancel */}
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>

        {/* Save */}
        <Button appearance="text" onClick={handleSubmit}>
          {t(`action.${contact ? "save" : "add"}`)}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ContactDialog;
