// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { InputHTMLAttributes, useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps, LangCode } from "@utils/types/common";
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
  const locale = useRouter().locale as LangCode;

  // Types
  type ContactIncludesObj = {
    students: boolean;
    teachers: boolean;
    parents: boolean;
    other: boolean;
  };

  type ContactIncludes = "students" | "teachers" | "parents" | "other";
  type ContactIncludesStrict = "students" | "teachers" | "parents";

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

  const contactValuesMap: {
    [key in ContactVia]: {
      type: "number" | "tel" | "email" | "url" | "text";
      attr?: InputHTMLAttributes<HTMLInputElement>;
      helperMsg?: string;
    };
  } = {
    Phone: {
      type: "tel",
      attr: { pattern: "\\d{9,10}" },
    },
    Email: {
      type: "email",
    },
    Website: {
      type: "url",
    },
    Facebook: {
      type: "text",
    },
    Line: {
      type: "text",
      attr: { minLength: 10, maxLength: 10 },
      helperMsg: t("dialog.addContact.value.line_helper"),
    },
    Instagram: {
      type: "text",
      attr: { pattern: "(?:(?:[\\w][\\.]{0,1})*[\\w]){1,29}" },
    },
    Discord: {
      type: "text",
      attr: { pattern: "[a-zA-Z0-9]{8}" },
      helperMsg: t("dialog.addContact.value.discord_helper"),
    },
    Other: {
      type: "text",
    },
  };

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
      other: boolean;
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
      other: false,
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
          other: false,
        },
      }),
    [show]
  );

  // useEffect(
  //   () => console.log(getDefaultLabel(contact.includes, locale)),
  //   [contact.includes]
  // );

  // Utils
  // TODO: This cannot be used yet because updating KeyboardInput’s value is not yet supported
  function getDefaultLabel(
    includes: ContactIncludesObj,
    locale: LangCode
  ): string {
    const includesArray = (Object.keys(includes) as ContactIncludes[]).filter(
      (key) => includes[key as ContactIncludes] && key != "other"
    );
    const numGroups = includesArray.length;

    if (numGroups == 0) return "";

    // For Thai label
    let groupTypeMap = {
      students: "นักเรียน",
      teachers: "อาจารย์",
      parents: "ผู้ปกครอง",
    };

    // For English label
    if (locale == "en-US") {
      groupTypeMap = {
        students: "Students",
        teachers: "Teachers",
        parents: "Parents",
      };
    }

    // (@SiravitPhokeed)
    // This should not use the translation files because both locales must be
    // available, no matter the user locale.
    // Doesn’t really matter right now though, we can’t use it. :(

    // FIXME: Use an object instead
    return t(
      `dialog.addContact.labelDefault.${
        numGroups == 1 ? "one" : numGroups == 2 ? "two" : "three"
      }${includes.other ? "_public" : ""}`,
      numGroups == 1
        ? { type1: groupTypeMap[includesArray[0] as ContactIncludesStrict] }
        : numGroups == 2
        ? {
            type1: groupTypeMap[includesArray[0] as ContactIncludesStrict],
            type2: groupTypeMap[includesArray[1] as ContactIncludesStrict],
          }
        : undefined
    );
  }

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
          name="value"
          type={contactValuesMap[contact.type].type}
          label={t(`dialog.addContact.value.${contact.type.toLowerCase()}`)}
          helperMsg={contactValuesMap[contact.type].helperMsg}
          errorMsg={t("dialog.addContact.value_error")}
          useAutoMsg
          onChange={(e) => setContact({ ...contact, value: e })}
          attr={contactValuesMap[contact.type].attr}
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
                <input
                  type="checkbox"
                  id="includes-4"
                  name="includes-4"
                  checked={contact.includes.other}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      includes: {
                        ...contact.includes,
                        other: e.target.checked,
                      },
                    })
                  }
                />
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
