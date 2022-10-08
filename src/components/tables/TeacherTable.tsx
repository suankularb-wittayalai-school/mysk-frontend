// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Button, MaterialIcon, Table } from "@suankularb-components/react";

// Components
import CopyButton from "@components/CopyButton";

// Types
import { LangCode } from "@utils/types/common";
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
  setShowEdit?: (value: boolean) => void;
  setEditingPerson?: (teacher: Teacher) => void;
  setShowConfDelTeacher?: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  return (
    <Table width={800}>
      <thead>
        <tr>
          <th className="w-2/12">{t("teacherList.table.id")}</th>
          <th className="w-6/12">{t("teacherList.table.name")}</th>
          <th className="w-2/12">{t("teacherList.table.classAdvisorAt")}</th>
          {setShowEdit && setEditingPerson && setShowConfDelTeacher && (
            <th className="w-2/12" />
          )}
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
              {teacher.classAdvisorAt?.number
                ? t("class", {
                    ns: "common",
                    number: teacher.classAdvisorAt?.number,
                  })
                : setShowEdit &&
                  setEditingPerson &&
                  setShowConfDelTeacher && (
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
            {setShowEdit && setEditingPerson && setShowConfDelTeacher && (
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <CopyButton textToCopy={nameJoiner(locale, teacher.name)} />
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
                    onClick={() => {
                      setShowConfDelTeacher(true);
                      setEditingPerson(teacher);
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

export default TeacherTable;
