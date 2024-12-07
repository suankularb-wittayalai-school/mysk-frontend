import ElectiveStudentList from "@/components/elective/ElectiveStudentList";
import EnrollmentIndicator from "@/components/elective/EnrollmentIndicator";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  AssistChip,
  Card,
  ChipSet,
  DURATION,
  EASING,
  MaterialIcon,
  Search,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState } from "react";
import shortUUID from "short-uuid";

/**
 * A Card that displays a list of all Students enrolled in an Elective Subject,
 * filterable by name.
 *
 * @param electiveSubject The Elective Subject to display the Students of.
 */
const ElectiveStudentListCard: StylableFC<{
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective/detail/students");

  const { fromUUID } = shortUUID();

  const [query, setQuery] = useState("");

  return (
    <section style={style} className={cn(`grid grid-cols-2`, className)}>
      <div className="flex flex-col gap-2 py-4 pl-6 pr-3">
        <Text type="title-medium">{t("title")}</Text>
        <ChipSet>
          <AssistChip
            icon={<MaterialIcon icon="print" />}
            href={`/teach/electives/${fromUUID(electiveSubject.id)}/print`}
            element={Link}
          >
            {t("action.print")}
          </AssistChip>
        </ChipSet>
        <div className="grow" />
        <EnrollmentIndicator
          classSize={electiveSubject.class_size}
          capSize={electiveSubject.cap_size}
          className="w-10 pb-1"
        />
      </div>

      <div className="overflow-y-auto overflow-x-hidden">
        {/* Search */}
        <div
          className={cn(`sticky top-0 z-10 pb-3 pl-3 pr-4 pt-4 before:absolute
            before:inset-0 before:rounded-tr-xl before:bg-gradient-to-b
            before:from-surface-bright`)}
        >
          <Search
            value={query}
            onChange={setQuery}
            locale={locale}
            alt={t("searchAlt")}
          />
        </div>

        {/* List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(DURATION.medium2, EASING.standardDecelerate)}
          className="space-y-1 pb-4 pl-3 pr-4"
        >
          <Card
            appearance="filled"
            // See: https://stackoverflow.com/a/68211003
            className={cn(`!bg-transparent
              [&_button:not(.skc-fullscreen-dialog_*)]:!bg-surface-container`)}
          >
            <ElectiveStudentList
              electiveSubject={electiveSubject}
              query={query}
            />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ElectiveStudentListCard;
