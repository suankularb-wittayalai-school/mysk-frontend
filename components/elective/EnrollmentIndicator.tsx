import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

/**
 * An indicator showing the enrollment status of an Elective Subject.
 *
 * @param classSize The number of students enrolled in the Elective Subject.
 * @param capSize The maximum number of students that can be enrolled in the Elective Subject.
 */
const EnrollmentIndicator: StylableFC<{
  classSize: number;
  capSize: number;
}> = ({ classSize, capSize, style, className }) => {
  const { t } = useTranslation("elective/list");
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
          i18nKey="elective/list:enrollment.label"
          values={translationValues}
          components={{
            0: (
              <Text
                type="body-medium"
                className={cn(
                  `!font-medium`,
                  isFull ? `text-error` : `text-primary`,
                )}
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
          `w-10 ![--_remainder-color:transparent] *:!gap-0 *:overflow-hidden
          [&>*>*:first-child]:z-10 [&>*>*:last-child]:hidden`,
          isFull
            ? `![--_indicator-color:var(--error)]`
            : `*:bg-primary-container`,
        )}
      />
    </div>
  );
};

export default EnrollmentIndicator;
