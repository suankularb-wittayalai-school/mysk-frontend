import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

/**
 * An indicator showing the number of student that have already check their attendance.
 *
 * @param classSize The number that have already taken attendance.
 * @param capSize The number of student in classroom.
 */
const CheerAttendanceIndicator: StylableFC<{
  classSize: number;
  capSize: number;
}> = ({ classSize, capSize, style, className }) => {
  const { t } = useTranslation("attendance/cheer/list");
  const translationValues = { count: classSize, max: capSize };

  const isFull = classSize >= capSize;

  return (
    <div
      aria-label={t("enrollment.alt", translationValues)}
      className={cn(`space-y-1`, className)}
      style={style}
    >
      <Text
        type="body-small"
        className="block text-center text-on-surface-variant"
      >
        <Trans
          i18nKey="attendance/cheer/list:enrollment.label"
          values={translationValues}
          components={{
            0: (
              <Text
                type="body-medium"
                className={cn(`!font-medium text-primary`)}
              >
                {null}
              </Text>
            ),
          }}
        />
      </Text>

      <Progress
        appearance="linear"
        alt={t("enrollment.progressAlt")}
        value={(classSize / capSize) * 100}
        visible
        className={cn(
          `w-10 ![--_remainder-color:transparent] *:!gap-0 *:overflow-hidden [&>*>*:first-child]:z-10 [&>*>*:last-child]:hidden`,
        )}
      />
    </div>
  );
};

export default CheerAttendanceIndicator;
