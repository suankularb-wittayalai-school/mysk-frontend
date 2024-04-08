import LookupClassCard from "@/components/classes/LookupClassCard";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A section of the Lookup Classes list that shows all Classrooms in a grade.
 *
 * @param grade The grade of the Classrooms in this section.
 * @param classrooms The Classrooms in this section.
 * @param selected The ID of the selected Classroom.
 * @param onSelectedChange The function to call when a Classroom is selected.
 * @param expandedByDefault Whether this section should be expanded by default.
 * @param titleOverride The title to show instead of the grade.
 */
const GradeSection: StylableFC<{
  grade?: string;
  classrooms: Pick<Classroom, "id" | "number" | "main_room">[];
  selected?: string;
  onSelectedChange: (value: string) => void;
  expandedByDefault?: boolean;
  titleOverride?: string;
}> = ({
  grade,
  classrooms,
  selected,
  onSelectedChange,
  expandedByDefault,
  titleOverride,
  style,
  className,
}) => {
  const { t: tx } = useTranslation("common");

  const [expanded, toggleExpanded] = useToggle(expandedByDefault);

  return (
    <motion.li
      layout="position"
      layoutId={titleOverride || grade}
      transition={transition(DURATION.medium4, EASING.standard)}
      style={style}
      className={cn(`space-y-2`, className)}
    >
      <div className="mx-2 grid grid-cols-[2.5rem,1fr] gap-2 sm:mx-0">
        {/* Expansion toggle */}
        <Button
          appearance="text"
          icon={
            <motion.div
              initial={{ rotate: expandedByDefault ? "180deg" : "0deg" }}
              animate={{ rotate: expanded ? "180deg" : "0deg" }}
              transition={transition(DURATION.short4, EASING.standard)}
            >
              <MaterialIcon icon="expand_more" />
            </motion.div>
          }
          onClick={() => {
            if (!expanded)
              va.track(
                "Expand Grade Section",
                grade ? { grade: `M.${grade}` } : undefined,
              );
            toggleExpanded();
          }}
        />

        {/* Grade */}
        <Text type="headline-medium">
          {titleOverride || tx("class", { number: grade })}
        </Text>
      </div>

      {/* List */}
      <AnimatePresence initial={false}>
        {expanded && (
          <ul className="space-y-1">
            {classrooms.map((classroom, idx) => (
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...transition(DURATION.medium4, EASING.standard),
                  delay: 0.025 * idx,
                }}
                key={classroom.id}
              >
                <LookupClassCard
                  classroom={classroom}
                  selected={selected}
                  onClick={onSelectedChange}
                />
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default GradeSection;
