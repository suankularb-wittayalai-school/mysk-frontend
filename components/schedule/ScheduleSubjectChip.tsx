// External libraries
import { motion, useAnimationControls } from "framer-motion";
import { FC, useContext, useState } from "react";

// SK Components
import {
  InputChip,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import AddPeriodDialog from "@/components/schedule/AddPeriodDialog";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Helpers
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { positionPxToPeriod } from "@/utils/helpers/schedule";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { SubjectWNameAndCode } from "@/utils/types/subject";

const ScheduleSubjectChip: FC<{ subject: SubjectWNameAndCode }> = ({
  subject,
}) => {
  // Translation
  const locale = useLocale();

  // Animation
  const { duration, easing } = useAnimationConfig();
  const animationControls = useAnimationControls();

  // Context
  const { additionSite, setAdditionSite, constraintsRef } =
    useContext(ScheduleContext);

  // Dialog control
  const [addOpen, setAddOpen] = useState<boolean>(false);

  function handleMouseMove(x: number, y: number) {
    const constraints = constraintsRef?.current;
    if (!constraints) return;

    const { startTime, day } = positionPxToPeriod(x, y, constraints);

    setAdditionSite!(startTime !== null ? { startTime, day } : undefined);
  }

  function handleDragEnd() {
    if (additionSite?.startTime === undefined) {
      animationControls.start({ x: 0, y: 0 });
      return;
    }
    animationControls.start({ opacity: 0.5 });

    setAddOpen(true);
  }

  async function handleDialogClose() {
    if (!addOpen) return;

    setAddOpen(false);
    setAdditionSite!();

    await animationControls.start({ opacity: 0, scale: 1.4 });
    animationControls.set({ x: 0, y: "-50%", scale: 1, scaleY: 0 });
    animationControls.start({ y: 0, opacity: 1, scaleY: 1 });
  }

  return (
    <>
      <motion.div
        animate={animationControls}
        transition={transition(duration.medium2, easing.standard)}
        drag
        dragMomentum={false}
        whileDrag={{ boxShadow: "var(--shadow-3)" }}
        onMouseMove={(event) => handleMouseMove(event.clientX, event.clientY)}
        onTouchMove={(event) =>
          handleMouseMove(event.touches[0].clientX, event.touches[0].clientY)
        }
        onDragEnd={handleDragEnd}
        className="!z-40 rounded-sm transition-shadow"
      >
        <InputChip
          icon={<MaterialIcon icon="drag_indicator" />}
          className="!cursor-grab touch-none !bg-surface-variant
            active:!cursor-grabbing [&_i]:text-on-surface-variant"
        >
          {[
            getLocaleString(subject.code, locale),
            getLocaleObj(subject.name, locale).name,
          ].join(" • ")}
        </InputChip>
      </motion.div>

      <AddPeriodDialog
        open={addOpen}
        subject={subject}
        onClose={handleDialogClose}
        onSubmit={() => {
          handleDialogClose();
        }}
      />
    </>
  );
};

export default ScheduleSubjectChip;
