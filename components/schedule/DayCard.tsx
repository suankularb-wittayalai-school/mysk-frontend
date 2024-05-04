import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { Day, setDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useTranslation } from "next-i18next";

/**
 * A Card in the header column of Schedule.
 * 
 * @param day The day of the week.
 */
const DayCard: StylableFC<{ day: Day }> = ({ day, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Get today.
  const today = toZonedTime(new Date(), process.env.NEXT_PUBLIC_SCHOOL_TZ);

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
