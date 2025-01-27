import cn from "@/utils/helpers/cn";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useState } from "react";

const ReportUploadImageCard = () => {
  const [inputHasFile, setInputHasFile] = useState<boolean>(false);
  const [inputFileName, setInputFileName] = useState<string>();

  return (
    <div className="flex flex-col gap-3">
      <span className="py-2 font-display text-base font-medium">
        อัปโหลดภาพการเรียนการสอน
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
          accept="image/png, image/jpeg, image/heif"
          className="hidden"
          onChange={handleUploadElement}
        />
        <Button
          className="!w-max"
          appearance="filled"
          icon={<MaterialIcon icon="publish" />}
        >
          อัปโหลด
        </Button>
        <p className="break-all text-center text-outline">
          {inputHasFile && inputFileName !== undefined
            ? inputFileName
            : "กดตรงนี้ หรือ ลากไฟล์มาใส่ เพื่ออัปโหลด"}
        </p>
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

    if (event.dataTransfer.items) {
      setInputHasFile(true);
    }
  }

  function handleUploadElement() {
    const fileInput = document.querySelector("#fileUpload") as HTMLInputElement;

    console.warn(fileInput?.files);

    setInputHasFile(true);
    return setInputFileName(
      fileInput?.files
        ? fileInput.files[0].name +
            " • " +
            Math.round((fileInput.files[0].size / 1000000) * 100) / 100 +
            " MB"
        : undefined,
    );
  }
};

export default ReportUploadImageCard;
