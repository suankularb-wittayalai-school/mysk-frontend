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

// Backend
import { editProfile } from "@utils/backend/account";

interface EditProfileDialogProps extends DialogProps {
  userRole: "student" | "teacher";
  setShowChangePassword?: Function;
  setShowDiscard?: Function;
}

const EditProfileDialog = ({
  userRole,
  show,
  onClose,
}: EditProfileDialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  // Dialog control
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({});

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

    console.log(form);
    editProfile(formData);
  }

  return (
    <>
      <Dialog
        type="large"
        label="edit-profile"
        title={
          userRole == "teacher"
            ? t("dialog.editProfile.title")
            : t("dialog.requestEditProfile.title")
        }
        supportingText={
          <>
            {userRole == "student" && (
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
              userRole == "teacher"
                ? t("dialog.editProfile.action.cancel")
                : t("dialog.requestEditProfile.action.cancel"),
            type: "close",
          },
          {
            name:
              userRole == "teacher"
                ? t("dialog.editProfile.action.save")
                : t("dialog.requestEditProfile.action.sendRequest"),
            type: "submit",
          },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => {
          validateAndSend();
          onClose();
        }}
      >
        <DialogSection name={t("profile.name.title")} isDoubleColumn>
          <Dropdown
            name="prefix"
            label={t("profile.name.prefix.label")}
            options={
              userRole == "teacher"
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
          />
          <KeyboardInput
            name="th-first-name"
            type="text"
            label={t("profile.name.firstName")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="th-middle-name"
            type="text"
            label={t("profile.name.middleName")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="th-last-name"
            type="text"
            label={t("profile.name.lastName")}
            onChange={() => {}}
          />
        </DialogSection>
        <DialogSection name={t("profile.enName.title")} isDoubleColumn>
          <KeyboardInput
            name="en-first-name"
            type="text"
            label={t("profile.enName.firstName")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="en-middle-name"
            type="text"
            label={t("profile.enName.middleName")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="en-last-name"
            type="text"
            label={t("profile.enName.lastName")}
            onChange={() => {}}
          />
        </DialogSection>
        {userRole == "teacher" && (
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
              label={t("profile.role.classCounselorAt")}
              options={classes.map((classItem) => ({
                value: classItem.id,
                label: classItem.name[locale],
              }))}
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

export default EditProfileDialog;
