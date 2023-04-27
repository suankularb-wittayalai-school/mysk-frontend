// External libraries
import { FC, Fragment } from "react";

// Types
import { LangCode, MultiLangString } from "@/utils/types/common";

// Helpers
import { cn } from "@/utils/helpers/className";

const MultilangText: FC<{
  text: MultiLangString;
  options?: Partial<{
    hideEmptyLanguage: boolean;
    priorityLanguage: LangCode;
  }>;
  className?: string;
}> = ({ text, options, className }) => (
  <div
    className={cn([
      "grid grid-cols-[1.25rem,1fr] gap-1",
      options?.priorityLanguage === "en-US" ? "flex-col-reverse" : "flex-col",
      className,
    ])}
  >
    {(["th", "en-US"] as LangCode[]).map(
      (langCode) =>
        !(options?.hideEmptyLanguage && !text[langCode]) && (
          <Fragment key={langCode}>
            {/* Icon */}
            <div
              aria-label={langCode === "en-US" ? "English" : "ภาษาไทย"}
              className={cn([
                `grid h-5 w-5 select-none place-content-center rounded-full
                 border-[1px]  text-[0.5rem]`,
                langCode === options?.priorityLanguage
                  ? `border-secondary text-secondary`
                  : `border-outline text-outline`,
              ])}
            >
              {langCode === "en-US" ? "EN" : "TH"}
            </div>

            {/* Text */}
            <p
              className={
                langCode !== options?.priorityLanguage
                  ? `text-outline`
                  : undefined
              }
            >
              {text[langCode]}
            </p>
          </Fragment>
        )
    )}
  </div>
);

export default MultilangText;
