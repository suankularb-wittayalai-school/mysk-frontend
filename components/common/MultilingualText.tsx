// Imports
import cn from "@/utils/helpers/cn";
import { LangCode, MultiLangString } from "@/utils/types/common";
import { unique } from "radash";
import { FC, Fragment } from "react";

const MultilangText: FC<{
  text: MultiLangString;
  options?: Partial<{
    combineIfAllIdentical: boolean;
    hideEmptyLanguage: boolean;
    hideIconsIfOnlyLanguage: boolean;
    priorityLanguage: LangCode;
  }>;
  className?: string;
}> = ({ text, options, className }) => {
  const numLanguagesWithContent = (Object.keys(text) as LangCode[]).filter(
    (locale) => text[locale],
  ).length;
  const allLanguagesAreIdentical = unique(Object.values(text)).length === 1;

  return (
    <div className={cn(`grid grid-cols-[1.25rem,1fr] gap-1`, className)}>
      {(
        (options?.priorityLanguage === "en-US"
          ? ["en-US", "th"]
          : ["th", "en-US"]) as LangCode[]
      ).map(
        (langCode, idx) =>
          !(options?.hideEmptyLanguage && !text[langCode]) && (
            <Fragment key={langCode}>
              {/* Icon */}
              {!(
                // Only show the icon if there is at least 2 languages
                (
                  (options?.hideIconsIfOnlyLanguage &&
                    numLanguagesWithContent === 1) ||
                  (options?.combineIfAllIdentical && allLanguagesAreIdentical)
                )
              ) && (
                <div
                  aria-label={langCode === "en-US" ? "English" : "ภาษาไทย"}
                  className={cn(
                    `grid h-5 w-5 select-none place-content-center rounded-xs
                    font-display text-[0.6875rem] font-bold tracking-tight`,
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
                  // Span 2 columns (taking over the icon space) if this is
                  // the only language or if all languages are identical
                  ((options?.hideIconsIfOnlyLanguage &&
                    numLanguagesWithContent === 1) ||
                    (options?.combineIfAllIdentical &&
                      allLanguagesAreIdentical)) &&
                    `col-span-2`,
                  options?.priorityLanguage &&
                    // Dim the text color if this isn’t the priority language
                    langCode !== options?.priorityLanguage &&
                    `text-outline`,
                  `empty:hidden`,
                )}
              >
                {options?.combineIfAllIdentical && allLanguagesAreIdentical
                  ? idx === 0 && text[langCode]
                  : text[langCode]}
              </p>
            </Fragment>
          ),
      )}
    </div>
  );
};

export default MultilangText;
