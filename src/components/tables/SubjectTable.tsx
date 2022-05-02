// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Button, MaterialIcon, Table } from "@suankularb-components/react";

// Components
import TeacherTeachingList from "@components/TeacherTeachingList";

// Types
import { Subject } from "@utils/types/subject";

// Helpers
import { getLocaleYear } from "@utils/helpers/date";

const SubjectTable = ({
  subjects,
  setShowEdit,
  setEditingSubject,
  setShowConfDelSubject,
}: {
  subjects: Array<Subject>;
  setShowEdit?: (value: boolean) => void;
  setEditingSubject?: (subject: Subject) => void;
  setShowConfDelSubject?: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Table width={800}>
      <thead>
        <tr>
          <th className="w-2/12">{t("subjectList.table.code")}</th>
          <th className="w-4/12">{t("subjectList.table.name")}</th>
          <th className="w-2/12">{t("subjectList.table.teachers")}</th>
          <th className="w-1/12">{t("subjectList.table.year")}</th>
          <th className="w-1/12">{t("subjectList.table.semester")}</th>
          {setShowEdit && setEditingSubject && setShowConfDelSubject && (
            <th className="w-2/12" />
          )}
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <tr key={subject.id}>
            <td>{subject.code[locale] ?? subject.code.th}</td>
            <td className="!text-left">
              {subject.name[locale].name ?? subject.name.th.name}
            </td>
            <td className="!text-left">
              <TeacherTeachingList teachers={subject.teachers} />
            </td>
            <td>{getLocaleYear(locale, subject.year)}</td>
            <td>{subject.semester}</td>
            {setShowEdit && setEditingSubject && setShowConfDelSubject && (
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    name={t("subjectList.table.action.edit")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="edit" />}
                    onClick={() => {
                      setEditingSubject(subject);
                      setShowEdit(true);
                    }}
                  />
                  <Button
                    name={t("subjectList.table.action.delete")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="delete" />}
                    isDangerous
                    onClick={() => {
                      setEditingSubject(subject);
                      setShowConfDelSubject(true);
                    }}
                  />
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SubjectTable;
