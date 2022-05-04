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
    "Website",
    "Facebook",
    "Line",
    "Instagram",
    "Discord",
    "Other",
  ];

  // Form control
  const [contact, setContact] = useState<{
    id: number;
    name: { "en-US": string; th: string };
    type: ContactVia;
    value: string;
    includes: {
      students: boolean;
      teachers: boolean;
      parents: boolean;
    };
  }>({
    id: 0,
    name: { "en-US": "", th: "" },
    type: "Phone",
    value: "",
    includes: {
      students: false,
      teachers: false,
      parents: false,
    },
  });

  useEffect(
    () =>
      setContact({
        id: 0,
        name: { "en-US": "", th: "" },
        type: "Phone",
        value: "",
        includes: {
          students: false,
          teachers: false,
          parents: false,
        },
      }),
    [show]
  );

  function validate(): boolean {
    if (!contact.name.th) return false;
    if (!meansOfContact.includes(contact.type)) return false;
    if (!contact.value) return false;

    return true;
  }

  return (
    <Dialog
      type="large"
      label="add-contact"
      title={t("dialog.addContact.title")}
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
            label: t(`contact.${type.toLowerCase()}`, {
              ns: "common",
            }),
            // FIXME: Allow JSX Element label please we need this
            // label: (
            //   <div className="flex flex-row items-center gap-2">
            //     <ContactIcon icon={type} width={16} />
            //     <span>
            //       {t(`contact.${type.toLowerCase()}`, {
            //         ns: "common",
            //       })}
            //     </span>
            //   </div>
            // ),
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
          onChange={(e) =>
            setContact({ ...contact, name: { ...contact.name, th: e } })
          }
        />
        <KeyboardInput
          name="name-en"
          type="text"
          label={t("dialog.addContact.nameEN")}
          onChange={(e) =>
            setContact({ ...contact, name: { ...contact.name, "en-US": e } })
          }
        />
        <KeyboardInput
          name="value"
          type="text"
          label={t("dialog.addContact.value")}
          onChange={(e) => setContact({ ...contact, value: e })}
        />

        {isGroup && (
          <div className="flex flex-col gap-2">
            {/* (@SiravitPhokeed) We definitely need SK Components™ for this,
                this looks pretty dumb tbh. */}
            <h3 className="!text-base">
              {t("dialog.addContact.includes.title")}
            </h3>
            <div className="grid grid-cols-2">
              <div className="flex flex-row gap-2">
                {/* Students */}
                <input
                  type="checkbox"
                  id="includes-1"
                  name="includes-1"
                  checked={contact.includes.students}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      includes: {
                        ...contact.includes,
                        students: e.target.checked,
                      },
                    })
                  }
                />
                <label htmlFor="includes-1">
                  {t("dialog.addContact.includes.students")}
                </label>
              </div>

              {/* Parents */}
              <div className="flex flex-row gap-2">
                <input
                  type="checkbox"
                  id="includes-2"
                  name="includes-2"
                  checked={contact.includes.parents}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      includes: {
                        ...contact.includes,
                        parents: e.target.checked,
                      },
                    })
                  }
                />
                <label htmlFor="includes-2">
                  {t("dialog.addContact.includes.parents")}
                </label>
              </div>
              <div className="flex flex-row gap-2">
                <input
                  type="checkbox"
                  id="includes-3"
                  name="includes-3"
                  checked={contact.includes.teachers}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      includes: {
                        ...contact.includes,
                        teachers: e.target.checked,
                      },
                    })
                  }
                />
                <label htmlFor="includes-3">
                  {t("dialog.addContact.includes.teachers")}
                </label>
              </div>
              <div className="flex flex-row gap-2">
                <input type="checkbox" id="includes-4" name="includes-4" />
                <label htmlFor="includes-4">
                  {t("dialog.addContact.includes.other")}
                </label>
              </div>
            </div>
          </div>
        )}
      </DialogSection>
    </Dialog>
  );
};

export default AddContactDialog;
