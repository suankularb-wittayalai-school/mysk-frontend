// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Button, MaterialIcon, Table } from "@suankularb-components/react";

// Types
import { LangCode } from "@utils/types/common";
import { Student } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const StudentTable = ({
  students,
  setShowEdit,
  setEditingPerson,
  setShowConfDelStudent,
}: {
  students: Array<Student>;
  setShowEdit?: (value: boolean) => void;
  setEditingPerson?: (student: Student) => void;
  setShowConfDelStudent?: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  return (
    <Table width={800}>
      <thead>
        <tr>
          <th className="w-2/12">{t("studentList.table.id")}</th>
          <th className="w-1/12">{t("studentList.table.class")}</th>
          <th className="w-1/12">{t("studentList.table.classNo")}</th>
          <th className="w-6/12">{t("studentList.table.name")}</th>
          {setShowEdit && setEditingPerson && setShowConfDelStudent && (
            <th className="w-2/12" />
          )}
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.studentID}</td>
            <td>{student.class.number}</td>
            <td>{student.classNo}</td>
            <td className="!text-left">
              {nameJoiner(
                locale,
                student.name,
                t(`name.prefix.${student.prefix}`, { ns: "common" }),
                {
                  prefix: true,
                }
              )}
            </td>
            {setShowEdit && setEditingPerson && setShowConfDelStudent && (
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    name={t("studentList.table.action.copy")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="content_copy" />}
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        nameJoiner(locale, student.name)
                      )
                    }
                    className="!hidden sm:!block"
                  />
                  <Button
                    name={t("studentList.table.action.edit")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="edit" />}
                    onClick={() => {
                      setShowEdit(true);
                      setEditingPerson(student);
                    }}
                  />
                  <Button
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="delete" />}
                    isDangerous
                    onClick={() => {
                      setShowConfDelStudent(true);
                      setEditingPerson(student);
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

export default StudentTable;
