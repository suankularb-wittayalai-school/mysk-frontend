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
    hideIconsIfOnlyLanguage: boolean;
    priorityLanguage: LangCode;
  }>;
  className?: string;
}> = ({ text, options, className }) => {
  const numLanguagesWithContent = (Object.keys(text) as LangCode[]).filter(
    (locale) => text[locale]
  ).length;

  return (
    <div className={cn(["grid grid-cols-[1.25rem,1fr] gap-1", className])}>
      {(
        (options?.priorityLanguage === "en-US"
          ? ["en-US", "th"]
          : ["th", "en-US"]) as LangCode[]
      ).map(
        (langCode) =>
          !(options?.hideEmptyLanguage && !text[langCode]) && (
            <Fragment key={langCode}>
              {/* Icon */}
              {!(
                // Only show the icon if there is at least 2 languages
                (
                  options?.hideIconsIfOnlyLanguage &&
                  numLanguagesWithContent === 1
                )
              ) && (
                <div
                  aria-label={langCode === "en-US" ? "English" : "ภาษาไทย"}
                  className={cn([
                    `grid h-5 w-5 select-none place-content-center rounded-full
                     border-1 text-[0.5rem]`,
                    !options?.priorityLanguage ||
                    langCode === options?.priorityLanguage
                      ? `border-secondary text-secondary`
                      : `border-outline text-outline`,
                  ])}
                >
                  {langCode === "en-US" ? "EN" : "TH"}
                </div>
              )}

              {/* Text */}
              <p
                className={cn([
                  options?.hideIconsIfOnlyLanguage &&
                    // Span 2 columns (taking over the icon space) if this is the
                    // only language
                    numLanguagesWithContent === 1 &&
                    `col-span-2`,
                  options?.priorityLanguage &&
                    // Dim the text color if this isn’t the priority language
                    langCode !== options?.priorityLanguage &&
                    `text-outline`,
                ])}
              >
                {text[langCode]}
              </p>
            </Fragment>
          )
      )}
    </div>
  );
};

export default MultilangText;
