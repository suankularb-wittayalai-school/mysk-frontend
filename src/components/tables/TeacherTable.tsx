// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Button, MaterialIcon, Table } from "@suankularb-components/react";

// Types
import { Teacher } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const TeacherTable = ({
  teachers,
  setShowEdit,
  setEditingPerson,
  setShowConfDelTeacher,
}: {
  teachers: Array<Teacher>;
  setShowEdit: (value: boolean) => void;
  setEditingPerson: (teacher: Teacher) => void;
  setShowConfDelTeacher: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Table width={800}>
      <thead>
        <tr>
          <th className="w-2/12">{t("teacherList.table.id")}</th>
          <th className="w-6/12">{t("teacherList.table.name")}</th>
          <th className="w-2/12">{t("teacherList.table.classAdvisorAt")}</th>
          <th className="w-2/12" />
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher.id}>
            <td>{teacher.teacherID}</td>
            <td className="!text-left">
              {nameJoiner(
                locale,
                teacher.name,
                t(`name.prefix.${teacher.prefix}`, { ns: "common" }),
                {
                  prefix: true,
                }
              )}
            </td>
            <td>
              {teacher.classAdvisorAt ? (
                teacher.classAdvisorAt?.name[locale] ||
                teacher.classAdvisorAt?.name.th
              ) : (
                <div className="grid place-content-center">
                  <Button
                    icon={<MaterialIcon icon="add" />}
                    iconOnly
                    type="text"
                    onClick={() => {
                      setShowEdit(true);
                      setEditingPerson(teacher);
                    }}
                  />
                </div>
              )}
            </td>
            <td>
              <div className="flex flex-row justify-center gap-2">
                <Button
                  name={t("studentList.table.action.copy")}
                  type="text"
                  iconOnly
                  icon={<MaterialIcon icon="content_copy" />}
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      nameJoiner(locale, teacher.name)
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
                    setEditingPerson(teacher);
                  }}
                />
                <Button
                  type="text"
                  iconOnly
                  icon={<MaterialIcon icon="delete" />}
                  isDangerous
                  onClick={() => setShowConfDelTeacher(true)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TeacherTable;
