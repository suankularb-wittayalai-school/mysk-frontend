// Modules
import { useTranslation } from "next-i18next";

import { useState } from "react";

// SK Components
import {
  Button,
  Dialog,
  DialogSection,
  FileInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { DialogProps } from "@utils/types/common";

const AddImageToNewsDialog = ({
  show,
  onClose,
  fileDestination,
}: DialogProps & { fileDestination: string }): JSX.Element => {
  const { t } = useTranslation("admin");
  const [image, setImage] = useState<File | null>(null);
  const [fileDir, setFileDir] = useState<string>("");

  async function uploadImage() {
    if (!image) return;

    const fileName: string = `${fileDestination}/img-${new Date().toISOString()}.${image.name
      .split(".")
      .pop()}`;
    const { error } = await supabase.storage
      .from("news")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error(error);
      return;
    }
    setFileDir(fileName);
  }

  return (
    <Dialog
      type="regular"
      label="add-image"
      title="Add image"
      actions={[{ name: t("Done"), type: "close" }]}
      show={show}
      onClose={() => onClose()}
    >
      <DialogSection name="upload">
        <div className="flex flex-row items-center gap-2">
          <FileInput
            name="file"
            label="Upload file"
            onChange={(e) => setImage(e)}
            className="grow"
          />
          <Button
            type="text"
            icon={<MaterialIcon icon="upload" />}
            iconOnly
            onClick={uploadImage}
            disabled={!image}
            className="mb-6"
          />
        </div>
      </DialogSection>
      {fileDir && (
        <DialogSection name="copy" title="Place in content">
          <p>
            Copy the below and paste it where you want your image to be placed
            in the Markdown field.
          </p>
          <code className="container-surface break-all rounded-lg p-2">
            {`![image](https://ykqqepbodqjhiwfjcvxe.supabase.co/storage/v1/object/public/news/${fileDir})`}
          </code>
        </DialogSection>
      )}
    </Dialog>
  );
};

export default AddImageToNewsDialog;
