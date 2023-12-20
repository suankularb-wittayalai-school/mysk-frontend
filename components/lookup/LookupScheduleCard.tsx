import Schedule from "@/components/schedule/Schedule";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import {
  Progress,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A Card that contains glanceable information of a Schedule, with the option to
 * show the full Schedule. This is intended to be used in Lookup Details Card.
 *
 * @param schedule The Schedule to draw information from.
 * @param open If the Card is open and shown.
 * @param loading If the Schedule data is loading.
 */
const LookupScheduleCard: StylableFC<{
  schedule: ScheduleType;
  role: UserRole;
  open?: boolean;
  loading?: boolean;
}> = ({ schedule, role, open, loading, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout="size"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(duration.medium2, easing.standardDecelerate)}
          style={{ ...style, borderRadius: 12 }}
          className={cn(`overflow-hidden rounded-md bg-surface`, className)}
        >
          {loading ? (
            <motion.div
              layout="position"
              transition={transition(duration.medium2, easing.standard)}
              className="grid place-content-center p-4"
            >
              <Progress appearance="circular" alt="Loading schedule…" visible />
            </motion.div>
          ) : (
            <motion.div
              layout="position"
              transition={transition(duration.medium2, easing.standard)}
            >
              <Schedule
                schedule={schedule}
                view={role}
                className={cn(
                  // Add left padding to Day Cards and Number Row.
                  `sm:[&>figure>ul>li>div:first-child]:!pl-3
                  sm:[&>figure>ul>li>ul:first-child>li:first-child]:!w-[9.75rem]`,
                  // Since Lookup Schedule Card only takes up half the screen,
                  // `sm` is pretty much like `base`, so we make the Day Cards
                  // static.
                  `sm:[&>figure>ul>li>div:first-child]:!static
                  md:[&>figure>ul>li>div:first-child]:!sticky
                  sm:[&>figure>ul>li>ul:first-child>li:first-child]:!static
                  md:[&>figure>ul>li>ul:first-child>li:first-child]:!sticky`,
                  // Add right padding to content (and fix left padding on
                  // mobile).
                  `[&>figure>ul]:!px-3 sm:[&>figure>ul]:!pl-0 sm:[&>figure>ul]:!pr-3`,
                  // Resize and vertical scroll on container.
                  `!mt-0 !pb-2 [&>figure]:resize-y [&>figure]:!overflow-y-auto
                  sm:[&>figure]:h-72 sm:[&>figure]:max-h-[24.125rem]`,
                )}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LookupScheduleCard;
