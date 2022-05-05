// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Button,
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";
import { Person, Student, Teacher } from "@utils/types/person";

// Backend
import { editProfile } from "@utils/backend/account";

interface EditProfileDialogProps extends DialogProps {
  user: Student | Teacher;
  setShowChangePassword?: Function;
  setShowDiscard?: Function;
}

const EditSelfDialog = ({
  user,
  show,
  onClose,
}: EditProfileDialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const locale = useRouter().locale as "en-US" | "th";

  // Dialog control
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
    prefix: user.prefix,
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName,
    thLastName: user.name.th.lastName,
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
  });

  // Dummybase
  const subjectGroups = [
    {
      id: 0,
      name: {
        "en-US": "Science and Technology",
        th: "วิทยาศาสตร์และเทคโนโลยี",
      },
    },
    {
      id: 1,
      name: {
        "en-US": "Mathematics",
        th: "คณิตศาสตร์",
      },
    },
    {
      id: 2,
      name: {
        "en-US": "Foreign Language",
        th: "ภาษาต่างประเทศ",
      },
    },
    {
      id: 3,
      name: {
        "en-US": "Thai",
        th: "ภาษาไทย",
      },
    },
  ];
  const classes = [
    {
      id: 509,
      name: {
        "en-US": "M.509",
        th: "ม.509",
      },
    },
  ];

  function validateAndSend() {
    let formData = new FormData();

    // Validates
    if (!["master", "mister", "miss", "missus"].includes(form.prefix))
      return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;
    if (!form.enFirstName) return false;
    if (!form.enLastName) return false;

    // Appends to form data
    formData.append("th-first-name", form.thFirstName);
    if (form.thMiddleName) formData.append("th-middle-name", form.thMiddleName);
    formData.append("th-last-name", form.thLastName);

    formData.append("en-first-name", form.enFirstName);
    if (form.enMiddleName) formData.append("en-middle-name", form.enMiddleName);
    formData.append("en-last-name", form.enLastName);

    // Sends
    editProfile(formData);
    return true;
  }

  return (
    <>
      <Dialog
        type="large"
        label="edit-profile"
        title={
          user.role == "teacher"
            ? t("dialog.editProfile.title")
            : t("dialog.requestEditProfile.title")
        }
        supportingText={
          <>
            {user.role == "student" && (
              <p>{t("dialog.requestEditProfile.supportingText")}</p>
            )}
            <div className="sm:hidden">
              <Button
                name={t("dialog.changePassword.title")}
                label={t("dialog.changePassword.title")}
                type="text"
                icon={<MaterialIcon icon="password" />}
                onClick={() => setShowChangePassword(true)}
              />
            </div>
          </>
        }
        actions={[
          {
            name:
              user.role == "teacher"
                ? t("dialog.editProfile.action.cancel")
                : t("dialog.requestEditProfile.action.cancel"),
            type: "close",
          },
          {
            name:
              user.role == "teacher"
                ? t("dialog.editProfile.action.save")
                : t("dialog.requestEditProfile.action.sendRequest"),
            type: "submit",
          },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => validateAndSend() && onClose()}
      >
        <DialogSection name={t("profile.name.title")} isDoubleColumn>
          <Dropdown
            name="prefix"
            label={t("profile.name.prefix.label")}
            options={
              user.role == "teacher"
                ? [
                    { value: "mister", label: t("profile.name.prefix.mister") },
                    { value: "miss", label: t("profile.name.prefix.miss") },
                    { value: "missus", label: t("profile.name.prefix.missus") },
                  ]
                : [
                    { value: "master", label: t("profile.name.prefix.master") },
                    { value: "mister", label: t("profile.name.prefix.mister") },
                  ]
            }
            defaultValue={user.prefix}
            onChange={(e: Person["prefix"]) => setForm({ ...form, prefix: e })}
          />
          <KeyboardInput
            name="th-first-name"
            type="text"
            label={t("profile.name.firstName")}
            defaultValue={user.name.th.firstName}
            onChange={(e: string) => setForm({ ...form, thFirstName: e })}
          />
          <KeyboardInput
            name="th-middle-name"
            type="text"
            label={t("profile.name.middleName")}
            defaultValue={user.name.th.middleName}
            onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
          />
          <KeyboardInput
            name="th-last-name"
            type="text"
            label={t("profile.name.lastName")}
            defaultValue={user.name.th.lastName}
            onChange={(e: string) => setForm({ ...form, thLastName: e })}
          />
        </DialogSection>
        <DialogSection name={t("profile.enName.title")} isDoubleColumn>
          <KeyboardInput
            name="en-first-name"
            type="text"
            label={t("profile.enName.firstName")}
            defaultValue={user.name["en-US"]?.firstName || ""}
            onChange={(e: string) => setForm({ ...form, thFirstName: e })}
          />
          <KeyboardInput
            name="en-middle-name"
            type="text"
            label={t("profile.enName.middleName")}
            defaultValue={user.name["en-US"]?.middleName || ""}
            onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
          />
          <KeyboardInput
            name="en-last-name"
            type="text"
            label={t("profile.enName.lastName")}
            defaultValue={user.name["en-US"]?.lastName || ""}
            onChange={(e: string) => setForm({ ...form, thLastName: e })}
          />
        </DialogSection>
        {user.role == "teacher" && (
          <DialogSection name={t("profile.role.title")} isDoubleColumn>
            <Dropdown
              name="subject-group"
              label={t("profile.role.subjectGroup")}
              options={subjectGroups.map((subjectGroup) => ({
                value: subjectGroup.id,
                label: subjectGroup.name[locale],
              }))}
            />
            <Dropdown
              name="class-counselor-at"
              label={t("profile.role.classAdvisorAt.label")}
              options={[
                {
                  value: 0,
                  label: t("profile.role.classAdvisorAt.none"),
                },
              ].concat(
                classes.map((classItem) => ({
                  value: classItem.id,
                  label: classItem.name[locale],
                }))
              )}
            />
          </DialogSection>
        )}
      </Dialog>
      <ChangePassword
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
};

export default EditSelfDialog;
