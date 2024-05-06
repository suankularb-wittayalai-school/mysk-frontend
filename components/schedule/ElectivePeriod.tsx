import HoverList from "@/components/person/HoverList";
import ElectivePeriodDialog from "@/components/schedule/ElectivePeriodDialog";
import MoreIndicator from "@/components/schedule/MoreIndicator";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { formatSubjectPeriodName } from "@/utils/helpers/schedule/formatSubjectPeriodName";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import { Interactive, MaterialIcon, Text } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * When many Schedule Periods overlap, they are grouped into a single Elective
 * Period.
 *
 * If the Student has chosen an Elective, Elective Period imitates a Subject
 * Period of that Elective. The More Indicator is shown to distinguish it from a
 * Subject Period.
 *
 * @param period The Schedule Period to render.
 * @param isInSession Whether the Schedule Period is currently in session.
 */
const ElectivePeriod: StylableFC<{
  period: SchedulePeriod;
  isInSession?: boolean;
}> = ({ period, isInSession, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  const mysk = useMySKClient();
  const chosenElective =
    (mysk.person?.role === UserRole.student &&
      period.content.find(
        (subject) =>
          (mysk.person as Student)?.chosen_elective?.code.th ===
          subject.subject.code.th,
      )) ||
    null;

  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <li
        style={style}
        className={cn(
          `group relative`,
          isInSession
            ? `[--_background-color:var(--tertiary-container)]
              [--_foreground-color:var(--on-tertiary-container)]`
            : chosenElective
              ? `[--_background-color:var(--secondary-container)]
                [--_foreground-color:var(--on-secondary-container)]`
              : `[--_background-color:var(--surface-variant)]
                [--_foreground-color:var(--primary)]`,
          className,
        )}
      >
        <Interactive
          className={cn(
            `h-full rounded-sm bg-[--_background-color]
            text-[--_foreground-color] transition-shadow focus:shadow-2`,
            isInSession ? "shadow-1 hover:shadow-2" : "hover:shadow-1",
          )}
          style={{ width: periodDurationToWidth(period.duration) }}
          onClick={() => {
            va.track("Open Period Details");
            setDetailsOpen(true);
          }}
        >
          {chosenElective ? (
            <div className="grid px-4 py-2 text-left *:truncate">
              <Text type="title-medium">
                {formatSubjectPeriodName(
                  period.duration,
                  chosenElective.subject,
                  locale,
                )}
              </Text>
              <Text type="body-small">
                <HoverList people={chosenElective.teachers} />
              </Text>
            </div>
          ) : (
            <div
              className={cn(
                `flex items-center justify-center`,
                period.duration < 2 ? `flex-col pt-1` : `flex-row gap-1.5`,
              )}
            >
              <MaterialIcon icon="collections_bookmark" size={20} />
              <Text type={period.duration < 2 ? "title-small" : "title-medium"}>
                {t("schedule.elective")}
              </Text>
            </div>
          )}
        </Interactive>
        <MoreIndicator
          style={{ height: 3, left: 12, bottom: -4, right: 12 }}
          className="absolute top-auto"
        />
      </li>
      <ElectivePeriodDialog
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default ElectivePeriod;
