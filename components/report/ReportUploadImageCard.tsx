import { FC, useState } from "react";
import { Teacher } from "@/utils/types/person";
import { Button, MaterialIcon } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import { useEffect } from "react";

const ReportUploadImageCard = () => {
  const [inputHasFile, setInputHasFile] = useState<boolean>(false);
  const [inputFileName, setInputFileName] = useState<string>();

  return (
    <div className="flex flex-col gap-3">
      <span className="font-display py-2 text-base font-medium">Upload Teaching Image</span>
      <div 
        onClick={handleUploadClick}
        onDragOver={handleUploadDragOver}
        onDrop={handleUploadDrop}
        className={cn(`flex flex-col justify-center items-center gap-2 rounded-xs h-32
          border border-outline p-4 hover:cursor-pointer`)}
      >
        <input type="file" name="" id="fileUpload" accept="image/png, image/jpeg, image/heif" className="hidden" onChange={handleUploadElement} />
        <Button
          className="!w-max"
          appearance="filled"
          icon={<MaterialIcon icon="publish" />}
        >
          Upload
        </Button>
        <p className="text-center text-outline">
          {
            (inputHasFile && (inputFileName !== undefined)) ? (
              <>{inputFileName}</>
            ) : (
              <>Click here or drag a file here to upload.</>
            )
          }
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
      setInputHasFile(true)
    }
  }

  function handleUploadElement() {
    const fileInput = document.querySelector("#fileUpload") as HTMLInputElement;
    
    console.warn(fileInput?.files);

    setInputHasFile(true)
    return setInputFileName(fileInput?.files ? fileInput.files[0].name : undefined);
  }
};



export default ReportUploadImageCard;
