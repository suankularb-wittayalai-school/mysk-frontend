import PersonCard from "@/components/person/PersonCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import sortStudents from "@/utils/helpers/person/sortStudents";
import { LangCode, StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * A list of Students enrolled in an Elective Subject.
 * 
 * @param electiveSubject The Elective Subject to display the Students of.
 * @param query The search query to filter the Students by.
 */
const ElectiveStudentList: StylableFC<{
  electiveSubject: ElectiveSubject;
  query: string;
}> = ({ electiveSubject, query, style, className }) => {
  const { locales } = useRouter() as { locales: LangCode[] };
  const { t } = useTranslation("elective", { keyPrefix: "detail.students" });

  /** Convert `applicable_classrooms` into an indexable format. */
  const classrooms = Object.fromEntries(
    electiveSubject.applicable_classrooms.map((classroom) => [
      classroom.id,
      classroom,
    ]),
  );

  /** Treat `students` for mapping. */
  const students = sortStudents(
    electiveSubject.students
      // Filter by name.
      .filter(
        (student) =>
          // Show all if there is no query.
          !query ||
          // Show if the query matches the student's name in at least one
          // locale.
          locales?.some((locale) =>
            getLocaleName(locale, student).includes(query),
          ),
      )
      // Add Classroom information (API only returns ID).
      .map((student) => ({
        ...student,
        classroom: student.classroom ? classrooms[student.classroom.id] : null,
        role: UserRole.student,
      })),
  );

  return (
    <ul style={style} className={cn(`space-y-1`, className)}>
      {students.map((student) => (
        <li key={student.id}>
          <PersonCard
            person={student}
            options={{
              // Show an asterisk if the Student is enrolled via randomization.
              suffix: electiveSubject.randomized_students.some(
                (randomizedStudent) => student.id === randomizedStudent.id,
              ) ? (
                <span title={t("randomized")} className="text-tertiary">
                  *
                </span>
              ) : undefined,
            }}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
};

export default ElectiveStudentList;
