// Imports
import { FC, Fragment } from "react";
import { LangCode, MultiLangString } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";

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
    (locale) => text[locale],
  ).length;

  return (
    <div className={cn(`grid grid-cols-[1.25rem,1fr] gap-1`, className)}>
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
                  className={cn(
                    `grid h-5 w-5 select-none place-content-center rounded-xs
                    border-1 font-display text-[0.6875rem] font-bold
                    tracking-tight`,
                    !options?.priorityLanguage ||
                      langCode === options?.priorityLanguage
                      ? `bg-surface-variant text-primary`
                      : `bg-surface-2 text-outline`,
                  )}
                >
                  {langCode === "en-US" ? "EN" : "TH"}
                </div>
              )}

              {/* Text */}
              <p
                className={cn(
                  options?.hideIconsIfOnlyLanguage &&
                    // Span 2 columns (taking over the icon space) if this is
                    // the only language
                    numLanguagesWithContent === 1 &&
                    `col-span-2`,
                  options?.priorityLanguage &&
                    // Dim the text color if this isn’t the priority language
                    langCode !== options?.priorityLanguage &&
                    `text-outline`,
                )}
              >
                {text[langCode]}
              </p>
            </Fragment>
          ),
      )}
    </div>
  );
};

export default MultilangText;
