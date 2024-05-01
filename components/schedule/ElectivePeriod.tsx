import HoverList from "@/components/person/HoverList";
import ElectivePeriodDetails from "@/components/schedule/ElectivePeriodDetails";
import MoreIndicator from "@/components/schedule/MoreIndicator";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { formatSubjectPeriodName } from "@/utils/helpers/schedule/formatSubjectPeriodName";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import { Interactive, Text } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * When many Schedule Periods overlap, they are grouped into a single Elective
 * Period.
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
  const chosenElective = period.content.find(
    (subject) =>
      (mysk.person as Student)?.chosen_elective?.code.th ===
      subject.subject.code.th,
  );

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
            `flex h-full flex-col justify-center rounded-sm
            bg-[--_background-color] px-4 py-2 text-left
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
            <>
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
            </>
          ) : (
            <Text type="title-medium" className="!leading-none">
              {t("schedule.elective")}
            </Text>
          )}
        </Interactive>
        <MoreIndicator
          style={{ height: 3, left: 12, bottom: -4, right: 12 }}
          className="absolute top-auto"
        />
      </li>
      <ElectivePeriodDetails
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default ElectivePeriod;
