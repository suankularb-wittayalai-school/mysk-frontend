import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { Button, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useState } from "react";
import { useRef } from "react";

interface ReportUploadImageCardProps {
  data: (result: string | ArrayBuffer | null) => void;
  type: (fileType: string) => void;
  alreadyHaveImage: boolean;
  reportId: string | undefined;
  enableEditing: boolean;
}

const ReportUploadImageCard = ({
  data,
  type,
  alreadyHaveImage,
  reportId,
  enableEditing,
}: ReportUploadImageCardProps) => {
  const [inputHasFile, setInputHasFile] = useState<boolean>(false);
  const [inputFileName, setInputFileName] = useState<string>();
  const [inputURL, setInputURL] = useState<string>();
  const [alreadyHaveImageURL, setAlreadyHaveImageURL] = useState<string>();
  const [fileTooLarge, setFileTooLarge] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation("report");

  const mysk = useMySKClient();

  async function getImageURLFunction(id: string) {
    const getImageURL: any = await mysk.fetch(
      `/v1/subjects/attendance/image/${id}`,
      {
        method: "GET",
      },
    );

    return setAlreadyHaveImageURL(getImageURL.image_url);
  }

  if (alreadyHaveImage && reportId != undefined) {
    getImageURLFunction(reportId);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="py-2 font-display text-base font-medium">
        {t("forms.upload.title")}
      </span>
      {!alreadyHaveImage && enableEditing ? (
        <div
          onDragOver={handleUploadDragOver}
          onDrop={handleUploadDrop}
          className={cn(
            `flex min-h-32 flex-col items-center justify-center gap-2 rounded-xs border p-4 hover:cursor-pointer` +
              (fileTooLarge ? " border-error" : " border-outline"),
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/heif, image/webp"
            className="page-fileUpload hidden"
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

              <Button
                className="!w-max"
                appearance="filled"
                icon={<MaterialIcon icon="folder_open" />}
                onClick={handleUploadClick}
              >
                {t("forms.upload.field.change")}
              </Button>
            </>
          ) : (
            <>
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="publish" />}
                onClick={handleUploadClick}
                className={
                  "!w-max" + (fileTooLarge ? " !bg-error !text-on-error" : "")
                }
              >
                {t("forms.upload.field.title")}
              </Button>
              <div
                className={
                  "text-center " +
                  (fileTooLarge ? "text-error" : "text-outline")
                }
              >
                {fileTooLarge ? (
                  <p className="font-bold">{t("forms.upload.size.tooLarge")}</p>
                ) : (
                  <p>{t("forms.upload.size.ok")}</p>
                )}
                <p>{t("forms.upload.field.subtitle")}</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className={!alreadyHaveImage ? "" : " h-64"}>
            {alreadyHaveImageURL && (
              <>
                <Image
                  src={alreadyHaveImageURL}
                  alt={alreadyHaveImageURL}
                  width={1280}
                  height={720}
                  className="m-auto block w-auto h-full object-contain object-center"
                />
                {enableEditing && (
                  <p className="text-outline pt-2 text-center">
                    {t("forms.upload.notEditable")}
                  </p>
                )}
              </>
            )}
            {!alreadyHaveImage && (
              <p className="text-outline">{t("forms.upload.noImage")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleUploadDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleUploadDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    return handleUploadElement();
  }

  function handleUploadElement() {
    const fileInput = fileInputRef.current;
    if (!fileInput) {
      return;
    }

    let fileReaderModule = new FileReader();

    fileReaderModule.addEventListener("load", () => {
      data(fileReaderModule.result);
    });

    if (fileInput.files != null) {
      if (fileInput.files[0] != undefined) {
        if (fileInput.files[0].size > 4500000) {
          setInputHasFile(false);
          setFileTooLarge(true);
          (
            document.querySelector(".page-fileUpload") as HTMLInputElement
          ).value = "";
          return;
        }
        setFileTooLarge(false);

        fileReaderModule.readAsArrayBuffer(fileInput.files[0]);
        type(fileInput.files[0].type.split(/(?<=\/)([^\/]+)/)[1]);

        setInputHasFile(true);
        setInputFileName(fileInput.files[0].name);
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
