// External libraries
import { motion } from "framer-motion";

// SK Components
import { Actions, Button } from "@suankularb-components/react";

// Components
import SubjectPeriod from "@components/schedule/SubjectPeriod";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";

const ElectivePeriodsReveal = ({
  schedulePeriod,
  toggleShow,
}: {
  schedulePeriod: SchedulePeriodType;
  toggleShow: () => void;
}): JSX.Element => {
  return (
    <motion.div
      className="mx-0 w-fit rounded-xl border-2 border-primary bg-surface-2 p-2 text-on-surface-variant"
      layoutId={`sp-${schedulePeriod.id}-button`}
      transition={animationTransition}
    >
      <div className="flex flex-row gap-2">
        <h1 className="truncate px-2 font-display text-xl font-medium">
          วิชาเลือก
        </h1>
        <ul className="flex flex-row gap-2">
          {schedulePeriod.content.map((item) => (
            <li key={item.id}>
              <SubjectPeriod
                schedulePeriod={item}
                isInSession={false}
                day={0}
                role="student"
                className="shadow"
              />
            </li>
          ))}
        </ul>
      </div>
      <Actions className="pt-2">
        <Button label="ปิดหน้าต่าง" type="text" onClick={toggleShow} />
      </Actions>
    </motion.div>
  );
};

export default ElectivePeriodsReveal;
