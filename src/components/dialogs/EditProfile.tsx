// Modules
import { useTranslation } from "next-i18next";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

// Backend
import { editProfile } from "@utils/backend/account";

interface EditProfileDialogProps extends DialogProps {
  userRole: "student" | "teacher";
}

const EditProfileDialog = ({
  userRole,
  show,
  onClose,
}: EditProfileDialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const ns = userRole == "teacher" ? "editProfile" : "requestEditProfile";

  return (
    <Dialog
      type="large"
      label="edit-profile"
      title={t(`dialog.${ns}.title`)}
      supportingText={
        userRole == "teacher"
          ? undefined
          : t("dialog.requestEditProfile.supportingText")
      }
      actions={[
        {
          name: t(`dialog.${ns}.action.cancel`),
          type: "close",
        },
        {
          name: t(`dialog.${ns}.action.sendRequest`),
          type: "submit",
        },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={async () => {
        onClose();
        editProfile();
      }}
    >
      <DialogSection name={t("profile.name.title")} isDoubleColumn>
        <Dropdown
          name="prefix"
          label={t("profile.name.prefix.label")}
          options={[
            { value: "master", label: t("profile.name.prefix.master") },
            { value: "mister", label: t("profile.name.prefix.mister") },
          ]}
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
    </Dialog>
  );
};

export default EditProfileDialog;
