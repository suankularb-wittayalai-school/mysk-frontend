import FeatureCard from "@/components/landing/FeatureCard";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog that shows a few headlining features of the latest version.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const PatchNotesDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
}> = ({ open, onClose, style, className }) => {
  const { t } = useTranslation("landing", {
    keyPrefix: "dialog.patchNotesDialog",
  });

  return (
    <Dialog
      open={open}
      width={360}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        icon={<MaterialIcon icon="star" />}
        title={t("title", { version: process.env.NEXT_PUBLIC_VERSION })}
        desc=""
        className="[&_p:empty]:hidden"
      />
      <DialogContent className="space-y-2 px-4">
        <FeatureCard
          icon={<MaterialIcon icon="book" />}
          title="Choose your elective"
          desc="View, enroll in, and trade electives with your friends"
        />
        <FeatureCard
          icon={<MaterialIcon icon="dashboard" />}
          title="Redesigned schedule"
          desc="Your schedule has been updated with your chosen elective, so you only see what you need"
        />
        <FeatureCard
          icon={<MaterialIcon icon="badge" />}
          title="Your virtual ID card"
          desc="View your MySK ID card in the Account page"
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.Close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default PatchNotesDialog;
