import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Card,
  CardHeader,
  DURATION,
  EASING,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import CheerAttendenceIndicator from "@/components/cheer/CheerAttendanceIndicator";
import { CheerTallyCount } from "@/utils/types/cheer";

/**
 * Cheer Lookup Class Card is a card that displays a Classroom in the Cheer attendance
 * list.
 *
 * @param classroom The Classroom to display.
 * @param selected If this Classroom is currently selected.
 * @param onClick The function to call when the card is clicked. Should select this Classroom.
 */
const CheerLookupClassCard: StylableFC<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "main_room" | "class_advisors" | "students"
  >;
  cheerTallyCounts: CheerTallyCount[];
  selected?: boolean;
  onClick: (value: string) => void;
}> = ({ classroom, cheerTallyCounts, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  const [period, setPeriod] = useState<
    (SchedulePeriod & { is_current: boolean }) | null
  >(null);

  const AdvisorName = () => {
    if (!classroom.class_advisors) return "";
    const advisor = classroom.class_advisors[0];
    return advisor
      ? [
          getLocaleString(advisor.first_name, locale),
          getLocaleString(advisor.last_name, locale),
        ].join(" ")
      : "";
  };

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => {
        onClick(classroom.id);
      }}
      style={style}
      className={cn(
        `group !grid w-full !grid-cols-[minmax(0,1fr),calc(4.5rem+2px)] items-center !rounded-none !border-transparent !bg-transparent text-left !transition-[padding,border,background-color] sm:!rounded-full`,
        selected &&
          `sm:!border-outline-variant sm:!bg-primary-container sm:pl-2 sm:!text-on-primary-container sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        title={tx("class", { number: classroom.number })}
        subtitle={
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={period?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition(DURATION.short4, EASING.standard)}
            >
              {classroom.main_room + " • " + AdvisorName()}
            </motion.span>
          </AnimatePresence>
        }
        className="grow [&>*>*]:block [&>*>*]:!truncate [&>*]:w-full"
      />
      <div className="-mt-3 mr-3 flex justify-center">
        <CheerAttendenceIndicator
          cheerTallyCount={cheerTallyCounts.find((cheerTallyCount)=>(cheerTallyCount.id === classroom.id))}
          className={cn(
            selected
              ? `[&_.skc-progress>*]:!bg-surface-bright`
              : `[&_.skc-progress>*]:md:!bg-surface-bright`,
            `pt-2 [&_.skc-progress>*]:transition-colors`,
          )}
        />
      </div>
    </Card>
  );
};

export default CheerLookupClassCard;
