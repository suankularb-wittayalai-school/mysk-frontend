// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// SK Components
import {
  Actions,
  Button,
  DialogContent,
  DialogHeader,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import MultilingualText from "@/components/common/MultilingualText";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";
import { periodTimes } from "@/utils/helpers/schedule";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { DialogComponent } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";

const PeriodDetails: DialogComponent<{ period: PeriodContentItem }> = ({
  period,
  open,
  onClose,
}) => {
  // Translation
  const locale = useLocale();

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
            className="pointer-events-none fixed inset-0 z-[100] grid
              place-items-center"
          >
            {/* Dialog */}
            <motion.div
              layoutId={`period-${period.id}`}
              transition={transition(duration.medium4, easing.standard)}
              className="pointer-events-auto w-80 rounded-xl bg-surface-3
                text-on-surface-variant"
            >
              <DialogHeader
                title={getLocaleObj(period.subject.name, locale).name}
                desc={[period.startTime, period.startTime + period.duration]
                  .map((j) =>
                    // Get the start/end time of this Period
                    Object.values(periodTimes[j])
                      // Format the hours and minutes parts of the time
                      .map((part) => part.toString().padStart(2, "0"))
                      // Join those parts
                      .join(":")
                  )
                  // Join the start and end
                  .join("-")}
              />
              <DialogContent className="flex flex-col gap-4 px-6 pt-6">
                {/* Teachers and coteachers */}
                <section aria-labelledby="period-teacher">
                  <h2 id="period-teacher" className="skc-title-medium">
                    Teachers
                  </h2>
                  <ul className="skc-body-medium">
                    {period.subject.teachers.map((teacher) => (
                      <li key={teacher.id}>
                        {nameJoiner(locale, teacher.name)}
                      </li>
                    ))}
                    {period.subject.coTeachers?.map((teacher) => (
                      <li className="text-outline" key={teacher.id}>
                        {nameJoiner(locale, teacher.name)}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="period-code">
                  <h2 id="period-code" className="skc-title-medium">
                    Subject code
                  </h2>
                  <p className="skc-body-medium">
                    <MultilingualText text={period.subject.code} />
                  </p>
                </section>
                {period.room && (
                  <section aria-labelledby="period-room">
                    <h2 id="period-room" className="skc-title-medium">
                      Room
                    </h2>
                    <p className="skc-body-medium">{period.room}</p>
                  </section>
                )}
              </DialogContent>
              <Actions className="p-6">
                <Button appearance="text" onClick={onClose}>
                  Close
                </Button>
              </Actions>
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

export default PeriodDetails;
