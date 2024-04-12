import ClassroomSubjectCard from "@/components/home/ClassroomSubjectCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ClassroomSubject } from "@/utils/types/subject";
import { Columns } from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import ElectiveEntryCard from "./ElectiveEntryCard";

/**
 * A list of Classroom Subjects.
 *
 * @param subjectList The list of Classroom Subjects to display.
 * @param query The search query to filter the list.
 */
const SubjectList: StylableFC<{
  subjectList: ClassroomSubject[];
  query: string;
}> = ({ subjectList, query, style, className }) => {
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
      <ElectiveEntryCard />
      <LayoutGroup>
        {filterredSubjectList.map((listItem) => (
          <ClassroomSubjectCard key={listItem.id} subject={listItem} />
        ))}
      </LayoutGroup>
    </Columns>
  );
};

export default SubjectList;
