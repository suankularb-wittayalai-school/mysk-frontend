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
import { usePlausible } from "next-plausible";
import { forwardRef } from "react";

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
    keyPrefix: "dialog.patchNotes",
  });

  const plausible = usePlausible();

  const icons = [
    <MaterialIcon key={0} icon="wifi_off" />,
    <MaterialIcon key={1} icon="search" />,
    <MaterialIcon key={2} icon="badge" />,
  ];

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
        {icons.map((icon, index) => (
          <FeatureCard
            key={index}
            icon={icon}
            title={t(`feature.${index}.title`)}
            desc={t(`feature.${index}.desc`)}
          />
        ))}
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="open_in_new" />}
          onClick={() => {
            onClose();
            plausible("Open Full Patch Notes");
          }}
          href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" />
          ))}
        >
          {t("action.seeFull")}
        </Button>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default PatchNotesDialog;
