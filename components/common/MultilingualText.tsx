// External libraries
import { FC } from "react";

const MultilingualText: FC<{ text: { th: string; "en-US"?: string } }> = ({
  text,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-row gap-1">
      <div
        aria-label="English"
        className="grid h-5 w-5 select-none place-content-center
          rounded-full border-[1px] border-secondary text-[0.5rem]
          text-secondary"
      >
        EN
      </div>
      <p>{text["en-US"]}</p>
    </div>
    <div className="flex flex-row gap-1">
      <div
        aria-label="Thai"
        className="grid h-5 w-5 select-none place-content-center
          rounded-full border-[1px] border-secondary text-[0.5rem]
          text-secondary"
      >
        TH
      </div>
      <p>{text.th}</p>
    </div>
  </div>
);

export default MultilingualText;
