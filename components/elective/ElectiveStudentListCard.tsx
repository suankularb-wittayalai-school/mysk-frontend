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
  MaterialIcon,
  Search,
  Text,
} from "@suankularb-components/react";
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
  const { t } = useTranslation("elective");

  const [query, setQuery] = useState("");

  const classrooms = Object.fromEntries(
    electiveSubject.applicable_classrooms.map((classroom) => [
      classroom.id,
      classroom,
    ]),
  );
  const students = sort(
    sort(
      electiveSubject.students.filter((student) =>
        locales?.some((locale) =>
          getLocaleName(locale as LangCode, student).includes(query),
        ),
      ),
      (student) => student.classroom?.number || 1000,
    ),
    (student) => (student.classroom ? -1 : student.class_no!),
  );

  return (
    <section style={style} className={cn(`grid grid-cols-2 gap-6`, className)}>
      <div className="flex flex-col gap-2 py-4 pl-6">
        <Text type="title-medium">รายชื่อนักเรียน</Text>
        <ChipSet>
          <AssistChip
            icon={<MaterialIcon icon="print" />}
            href={`/teach/electives/${electiveSubject.session_code}/print`}
            element={Link}
          >
            พิมพ์
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
          className={cn(`sticky top-0 z-10 mb-10 h-11 rounded-tr-xl
            bg-surface-bright pr-4 pt-4`)}
        >
          <Search
            value={query}
            onChange={setQuery}
            locale={locale}
            alt="Search enrolled Students"
          />
        </div>

        {/* List */}
        <div className="space-y-1 pb-4 pr-4">
          {students.map((student) => (
            <PersonCard
              key={student.id}
              person={{
                ...student,
                classroom: student.classroom
                  ? classrooms[student.classroom.id]
                  : null,
                role: UserRole.student,
              }}
              className="w-full !border-0 !bg-surface-container"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElectiveStudentListCard;
