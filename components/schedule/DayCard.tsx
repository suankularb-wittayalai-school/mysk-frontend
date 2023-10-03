// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { setDay } from "date-fns";
import { useTranslation } from "next-i18next";

const DayCard: StylableFC<{ day: Day }> = ({ day, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Get today
  const today = new Date();

  return (
    <div
      style={style}
      className={cn(
        `z-30 -my-1 py-1 pr-4 sm:sticky sm:left-0 sm:bg-background`,
        className,
      )}
    >
      <div
        className={cn(`flex w-32 flex-col rounded-sm bg-primary-container px-4
          py-2 text-on-primary-container`)}
      >
        <Text type="title-medium">{t(`datetime.day.${day}`)}</Text>
        <Text type="body-small" element="time">
          {setDay(today, day).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </div>
    </div>
  );
};

export default DayCard;
