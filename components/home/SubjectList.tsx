import ClassroomSubjectCard from "@/components/home/ClassroomSubjectCard";
import LearnElectiveEntryCard from "@/components/home/LearnElectiveEntryCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { ElectivePermissions } from "@/utils/helpers/elective/electivePermissionsAt";
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
 * @param electivePermissions The permissions available to this Student for Electives.
 * @param enrolledElective The Elective Subject this Student is enrolled in.
 */
const SubjectList: StylableFC<{
  subjectList: ClassroomSubject[];
  query: string;
  electivePermissions: ElectivePermissions;
  enrolledElective: ElectiveSubject | null;
}> = ({
  subjectList,
  query,
  electivePermissions,
  enrolledElective,
  style,
  className,
}) => {
  const locale = useLocale();

  const mysk = useMySKClient();

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
      {(electivePermissions.view || mysk.user?.is_admin) && (
        <LearnElectiveEntryCard
          electivePermissions={electivePermissions}
          enrolledElective={enrolledElective}
        />
      )}
      <LayoutGroup>
        {filterredSubjectList.map((listItem) => (
          <ClassroomSubjectCard key={listItem.id} subject={listItem} />
        ))}
      </LayoutGroup>
    </Columns>
  );
};

export default SubjectList;
