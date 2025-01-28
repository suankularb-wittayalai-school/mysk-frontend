import cn from "@/utils/helpers/cn";
import { Button, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useState } from "react";

interface ReportUploadImageCardProps {
  data: (result: string | ArrayBuffer | null) => void;
  type: (fileType: string) => void;
}

const ReportUploadImageCard = ({ data, type }: ReportUploadImageCardProps) => {
  const [inputHasFile, setInputHasFile] = useState<boolean>(false);
  const [inputFileName, setInputFileName] = useState<string>();
  const [inputURL, setInputURL] = useState<string>();

  const { t } = useTranslation("report");

  return (
    <div className="flex flex-col gap-3">
      <span className="py-2 font-display text-base font-medium">
        {t("forms.upload.title")}
      </span>
      <div
        onClick={handleUploadClick}
        onDragOver={handleUploadDragOver}
        onDrop={handleUploadDrop}
        className={cn(
          `flex min-h-32 flex-col items-center justify-center gap-2 rounded-xs border border-outline p-4 hover:cursor-pointer`,
        )}
      >
        <input
          type="file"
          name=""
          id="fileUpload"
          accept="image/png, image/jpeg, image/heif, image/webp"
          className="hidden"
          onChange={handleUploadElement}
        />

        {inputHasFile && inputURL !== undefined ? (
          <>
            <Image
              src={inputURL}
              alt={inputURL}
              width={1280}
              height={720}

              className="max-h-32 w-auto"
            />
            <p>{inputFileName}</p>
          </>
        ) : (
          <>
            <Button
              className="!w-max"
              appearance="filled"
              icon={<MaterialIcon icon="publish" />}
            >
              {t("forms.upload.field.title")}
            </Button>
            <div className="break-all text-center text-outline">
              <p>{t("forms.upload.field.subtitle")}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function handleUploadClick() {
    return (document.querySelector("#fileUpload") as HTMLInputElement)?.click();
  }

  function handleUploadDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleUploadDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    return handleUploadElement();
  }

  function handleUploadElement() {
    const fileInput = document.querySelector("#fileUpload") as HTMLInputElement;

    let fileReaderModule = new FileReader();

    fileReaderModule.addEventListener("load", () => {
      data(fileReaderModule.result)
      console.warn(fileReaderModule.result);
    });
    if (fileInput.files != null) { 
      if (fileInput.files[0] != undefined) {
        fileReaderModule.readAsArrayBuffer(fileInput.files[0]);
        type(fileInput.files[0].type.split(/(?<=\/)([^\/]+)/)[1])
  
        setInputHasFile(true);
        setInputFileName(fileInput.files[0].name)
        setInputURL(
          fileInput?.files && fileInput.files[0]
            ? URL.createObjectURL(fileInput.files[0])
            : undefined,
        );
      }
    }
  }
};

export default ReportUploadImageCard;
