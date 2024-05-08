import EnrollmentIndicator from "@/components/elective/EnrollmentIndicator";
import PersonCard from "@/components/person/PersonCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { LangCode, StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  DURATION,
  EASING,
  MaterialIcon,
  Search,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { sort } from "radash";
import { useState } from "react";

/**
 * A Card that displays a list of all Students enrolled in an Elective Subject,
 * filterrable by name.
 *
 * @param electiveSubject The Elective Subject to display the Students of.
 */
const ElectiveStudentListCard: StylableFC<{
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, style, className }) => {
  const locale = useLocale();
  const { locales } = useRouter();
  const { t } = useTranslation("elective", { keyPrefix: "detail.students" });

  const [query, setQuery] = useState("");

  /** Convert `applicable_classrooms` into an indexable format. */
  const classrooms = Object.fromEntries(
    electiveSubject.applicable_classrooms.map((classroom) => [
      classroom.id,
      classroom,
    ]),
  );

  /** Treat `students` for mapping. */
  const students = sort(
    sort(
      electiveSubject.students
        // Filter by name.
        .filter(
          (student) =>
            // Show all if there is no query.
            !query ||
            // Show if the query matches the student's name in at least one
            // locale.
            locales?.some((locale) =>
              getLocaleName(locale as LangCode, student).includes(query),
            ),
        )
        // Add Classroom information (API only returns ID).
        .map((student) => ({
          ...student,
          classroom: student.classroom
            ? classrooms[student.classroom.id]
            : null,
          role: UserRole.student as const,
        })),
      // Sort by number in classroom, none at top.
      (student) => student.class_no || 0,
    ),
    // Sort by classroom number, none at bottom. Students must have a Classroom
    // to enroll in an Elective Subject anyway so this is just a way to hide
    // if things go wrong but not being dishonest, according to @smartwhatt.
    (student) => student.classroom?.number || 1000,
  );

  return (
    <section style={style} className={cn(`grid grid-cols-2 gap-6`, className)}>
      <div className="flex flex-col gap-2 py-4 pl-6">
        <Text type="title-medium">{t("title")}</Text>
        <ChipSet>
          <AssistChip
            icon={<MaterialIcon icon="print" />}
            href={`/teach/electives/${electiveSubject.session_code}/print`}
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
          className={cn(`sticky top-0 z-10 pb-3 pr-4 pt-4 before:absolute
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
          className="space-y-1 pb-4 pr-4"
        >
          {students.map((student) => (
            <PersonCard
              key={student.id}
              person={student}
              options={{
                // Show an asterisk if the Student is enrolled via
                // randomization.
                suffix: electiveSubject.randomized_students.some(
                  (randomizedStudent) => student.id === randomizedStudent.id,
                ) ? (
                  <span title={t("randomized")} className="text-tertiary">
                    *
                  </span>
                ) : undefined,
              }}
              className="w-full !border-0 !bg-surface-container"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ElectiveStudentListCard;
