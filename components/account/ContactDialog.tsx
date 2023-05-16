// External libraries
import { useTranslation } from "next-i18next";
import { ComponentProps, useEffect, useReducer } from "react";

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

// Internal components
import ContactCard from "@/components/account/ContactCard";

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
      type: ComponentProps<"input">["type"];
      helperMsg?: string;
      validate?: (value: string) => boolean;
    };
  } = {
    Phone: {
      type: "tel",
      validate: (value) => /^\d{9,10}$/.test(value),
    },
    Email: { type: "email" },
    Website: { type: "url" },
    Facebook: { type: "text" },
    Line: { type: "text" },
    Instagram: {
      type: "text",
      validate: (value) => /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/i.test(value),
    },
    Discord: {
      type: "text",
      validate: (value) => /^([a-zA-Z0-9]{8}|.{3,32}#[0-9]{4})$/.test(value),
    },
    Other: { type: "text" },
  };

  const [counter, incrementCounter] = useReducer((counter) => counter + 1, 1);
  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "nameTH" | "nameEN" | "type" | "value"
  >([
    { key: "nameTH", defaultValue: contact?.name?.th },
    { key: "nameEN", defaultValue: contact?.name?.["en-US"] },
    { key: "type", required: true, defaultValue: contact?.type || "Phone" },
    { key: "value", required: true, defaultValue: contact?.value },
  ]);

  // Format group invite codes from invite links for Discord
  useEffect(() => {
    if (form.type === "Discord")
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
          (contactValuesMap[form.type as ContactVia].validate
            ? contactValuesMap[form.type as ContactVia].validate!(form.value)
            : true)
        )
      )
    )
      return;
    onSubmit({
      id: contact?.id || counter,
      // Omit the `name` key if the Thai Label field is empty
      ...(form.nameTH
        ? { name: { th: form.nameTH, "en-US": form.nameEN } }
        : {}),
      type: form.type as ContactVia,
      value: form.value,
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
                  // Omit the `name` key if the Thai Label field is empty
                  ...(form.nameTH
                    ? { name: { th: form.nameTH, "en-US": form.nameEN } }
                    : {}),
                  type: form.type as ContactVia,
                  value: form.value,
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
            error={
              form.value && contactValuesMap[form.type as ContactVia].validate
                ? !contactValuesMap[form.type as ContactVia].validate!(
                    form.value
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
