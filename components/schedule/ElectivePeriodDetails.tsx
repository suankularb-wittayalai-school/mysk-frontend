// Imports
import PeriodDetailsContent from "@/components/schedule/PeriodDetailsContent";
import cn from "@/utils/helpers/cn";
import { periodTimes } from "@/utils/helpers/schedule";
import { getLocaleString } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { StylableFC } from "@/utils/types/common";
import { DialogFC } from "@/utils/types/component";
import { PeriodContentItem, SchedulePeriod } from "@/utils/types/schedule";
import {
  Button,
  Card,
  Columns,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

const SubjectPeriodCard: StylableFC<{
  period: SchedulePeriod;
  subject: PeriodContentItem;
}> = ({ period, subject, style, className }) => {
  // Translation
  const locale = useLocale();

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(`!bg-surface`, className)}
    >
      <div
        className={cn(`flex flex-row gap-2 border-b-1 border-b-outline-variant
          px-4 py-2`)}
      >
        <div className="flex flex-col">
          <Text type="title-medium" element="h2">
            {getLocaleString(subject.subject.name, locale)}
          </Text>
          <Text type="body-small" element="time">
            {[period.start_time - 1, period.start_time + period.duration - 1]
              .map((j) =>
                // Get the start/end time of this Period
                Object.values(periodTimes[j])
                  // Format the hours and minutes parts of the time
                  .map((part) => part.toString().padStart(2, "0"))
                  // Join those parts
                  .join(":"),
              )
              // Join the start and end
              .join("-")}
          </Text>
        </div>
      </div>
      <Columns columns={2} className="px-4 pb-3 pt-2">
        <PeriodDetailsContent period={subject} />
      </Columns>
    </Card>
  );
};

const ElectivePeriodDetails: DialogFC<{
  period: SchedulePeriod;
}> = ({ period, open, onClose }) => {
  // Translation
  const { t } = useTranslation("schedule");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Close the Dialog with the escape key
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dialog container (for positioning) */}
          <div
            className={cn(`pointer-events-none fixed inset-0 z-[100] grid
              place-items-center`)}
          >
            {/* Dialog */}
            <motion.div
              role="alertdialog"
              aria-modal
              layoutId={`elective-period-${period.id}`}
              transition={transition(duration.medium4, easing.standard)}
              className={cn(`pointer-events-auto max-h-[calc(100vh-3rem)] w-96
                max-w-[calc(100vw-3rem)] overflow-y-auto overflow-x-hidden
                rounded-xl bg-surface-3 text-on-surface-variant
                supports-[height:100dvh]:max-h-[calc(100dvh-3rem)]`)}
            >
              {/* Top app bar */}
              <div
                className={cn(`sticky top-0 flex flex-row items-center
                  gap-2 border-b-1 border-b-outline bg-surface-3 p-2`)}
              >
                <Button
                  appearance="text"
                  icon={<MaterialIcon icon="close" />}
                  onClick={onClose}
                  className={cn(`!text-on-surface before:!bg-on-surface
                    [&_span]:!bg-on-surface`)}
                />
                <Text type="headline-small" element="h1">
                  {t("dialog.electivePeriodDetails.title")}
                </Text>
              </div>

              {/* Subject list */}
              <div className="flex flex-col gap-4 p-6 pt-5">
                <Text type="body-medium" element="p">
                  {t("dialog.electivePeriodDetails.desc")}
                </Text>

                {period.content
                  .sort((a, b) =>
                    a.subject.code.th > b.subject.code.th ? 1 : -1,
                  )
                  .map((subject) => (
                    <SubjectPeriodCard
                      key={subject.id}
                      period={period}
                      subject={subject}
                    />
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={transition(duration.medium4, easing.standard)}
            className="skc-scrim"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default ElectivePeriodDetails;
