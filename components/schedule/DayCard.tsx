// External libraries
import { setDay } from "date-fns";
import { useTranslation } from "next-i18next";
import { FC } from "react";

// Types
import { useLocale } from "@/utils/hooks/i18n";

const DayCard: FC<{ day: Day }> = ({ day }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Get today
  const today = new Date();

  return (
    <div className="z-20 -my-1 py-1 pr-4 sm:sticky sm:left-0 sm:bg-background">
      <div
        className="flex w-32 flex-col rounded-sm bg-primary-container px-4 py-2
          text-on-primary-container"
      >
        <span className="skc-title-medium">{t(`datetime.day.${day}`)}</span>
        <time className="skc-body-small">
          {setDay(today, day).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
    </div>
  );
};

export default DayCard;
