import ClassroomSubjectCard from "@/components/home/ClassroomSubjectCard";
import LearnElectiveEntryCard from "@/components/home/LearnElectiveEntryCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { ClassroomSubject } from "@/utils/types/subject";
import { Columns } from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";

/**
 * A list of Classroom Subjects.
 *
 * @param subjectList The list of Classroom Subjects to display.
 * @param query The search query to filter the list.
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 * @param enrolledElective The Elective Subject this Student is enrolled in.
 */
const SubjectList: StylableFC<{
  subjectList: ClassroomSubject[];
  query: string;
  inEnrollmentPeriod?: boolean;
  enrolledElective: ElectiveSubject | null;
}> = ({
  subjectList,
  query,
  inEnrollmentPeriod,
  enrolledElective,
  style,
  className,
}) => {
  const locale = useLocale();

  const filterredSubjectList = query
    ? subjectList.filter(
        (listItem) =>
          getLocaleString(listItem.subject.name, locale).includes(query) ||
          getLocaleString(listItem.subject.code, locale).includes(query) ||
          listItem.teachers.filter((teacher) =>
            getLocaleName(locale, teacher).includes(query),
          ).length,
      )
    : subjectList;

  return (
    <Columns columns={3} element="ul" style={style} className={className}>
      <LearnElectiveEntryCard
        inEnrollmentPeriod={inEnrollmentPeriod}
        enrolledElective={enrolledElective}
      />
      <LayoutGroup>
        {filterredSubjectList.map((listItem) => (
          <ClassroomSubjectCard key={listItem.id} subject={listItem} />
        ))}
      </LayoutGroup>
    </Columns>
  );
};

export default SubjectList;
