// External libraries
import Image from "next/image";
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog, DialogActions } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const ImageDialog = ({
  show,
  onClose,
  src,
  className,
}: DialogProps & { src: string; className?: string }): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Dialog
      type="large"
      label="image"
      title={t("dialog.image.title")}
      show={show}
      isBlank
      onClose={() => onClose()}
    >
      <div
        className={`relative w-[calc(100%)] bg-surface-variant ${
          className || "aspect-[4/3]"
        }`}
      >
        <Image src={src} layout="fill" objectFit="contain" alt="" />
      </div>
      <DialogActions
        actions={[
          {
            name: t("dialog.image.action.close"),
            type: "close",
          },
        ]}
        onClose={onClose}
      />
    </Dialog>
  );
};

export default ImageDialog;
