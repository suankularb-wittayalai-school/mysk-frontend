// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";

// Types
import { DialogProps } from "@utils/types/common";
import { Contact, ContactVia } from "@utils/types/contact";

const AddContactDialog = ({
  show,
  onClose,
  onSubmit,
  isGroup,
}: DialogProps & {
  onSubmit: (contact: Contact) => void;
  isGroup?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";

  // Constants
  const meansOfContact: ContactVia[] = [
    "Phone",
    "Email",
    "Facebook",
    "Line",
    "Instagram",
    "Website",
    "Discord",
    "Other",
  ];

  // Form control
  const [contact, setContact] = useState<Contact>({
    id: 0,
    name: {
      "en-US": "",
      th: "",
    },
    type: "Phone",
    value: "",
  });

  function validate(): boolean {
    if (!contact.name.th) return false;
    if (meansOfContact.includes(contact.type)) return false;
    if (!contact.value) return false;

    return true;
  }

  return (
    <Dialog
      type="large"
      label="add-contact"
      title={t("dialog.addContact.title")}
      supportingText={t("dialog.addContact.supportingText")}
      actions={[
        { name: t("dialog.addContact.action.cancel"), type: "close" },
        {
          name: t("dialog.addContact.action.add"),
          type: "submit",
          disabled: !validate(),
        },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => onSubmit(contact)}
    >
      <DialogSection isDoubleColumn hasNoGap>
        <Dropdown
          name="type"
          label={t("dialog.addContact.type")}
          options={meansOfContact.map((type) => ({
            value: type,
            label: (
              <div className="flex flex-row items-center gap-2">
                <ContactIcon icon={type} width={16} />
                <span>
                  {t(`contact.${type.toLowerCase()}`, {
                    ns: "common",
                  })}
                </span>
              </div>
            ),
          }))}
          onChange={(e: string) =>
            setContact({
              ...contact,
              type: e as ContactVia,
            })
          }
        />
        <KeyboardInput
          name="name-th"
          type="text"
          label={t("dialog.addContact.nameTH")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="name-en"
          type="text"
          label={t("dialog.addContact.nameEN")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="value"
          type="text"
          label={t("dialog.addContact.value")}
          helperMsg="How to find this account."
          onChange={() => {}}
        />
        {isGroup && (
          <div>
            {/* (@SiravitPhokeed) We definitely need SK Components™ for this,
                this looks pretty dumb tbh. */}
            <h3 className="!text-base">Includes</h3>
            <div className="grid grid-cols-2">
              <div className="flex flex-row gap-2">
                <input type="checkbox" id="includes-1" name="includes-1" />
                <label htmlFor="includes-1">Students</label>
              </div>
              <div className="flex flex-row gap-2">
                <input type="checkbox" id="includes-2" name="includes-2" />
                <label htmlFor="includes-2">Teachers</label>
              </div>
              <div className="flex flex-row gap-2">
                <input type="checkbox" id="includes-3" name="includes-3" />
                <label htmlFor="includes-3">Parents</label>
              </div>
              <div className="flex flex-row gap-2">
                <input type="checkbox" id="includes-4" name="includes-4" />
                <label htmlFor="includes-4">Other</label>
              </div>
            </div>
          </div>
        )}
      </DialogSection>
    </Dialog>
  );
};

export default AddContactDialog;
