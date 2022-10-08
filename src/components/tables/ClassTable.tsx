// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Button, MaterialIcon, Table } from "@suankularb-components/react";

// Types
import { Class } from "@utils/types/class";
import { LangCode } from "@utils/types/common";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { getLocaleYear } from "@utils/helpers/date";

const ClassTable = ({
  classes,
  setShowEdit,
  setEditingClass,
  setShowConfDel,
}: {
  classes: Array<Class>;
  setShowEdit?: (value: boolean) => void;
  setEditingClass?: (classItem: Class) => void;
  setShowConfDel?: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  return (
    <Table width={800}>
      <thead>
        <tr>
          <th className="w-6/12">{t("classList.table.name")}</th>
          <th className="w-2/12">{t("classList.table.advisor")}</th>
          <th className="w-1/12">{t("classList.table.year")}</th>
          {setShowEdit && setEditingClass && setShowConfDel && (
            <th className="w-1/12" />
          )}
        </tr>
      </thead>
      <tbody>
        {classes.map((classItem) => (
          <tr key={classItem.id}>
            {/* Class number */}
            <td className="!text-left">
              {t("class", { ns: "common", number: classItem.number })}
            </td>

            {/* Class advisors */}
            <td className="!text-left">
              {classItem.classAdvisors.length > 0 &&
                nameJoiner(locale, classItem.classAdvisors[0].name)}
              <abbr
                className="text-surface-variant"
                title={classItem.classAdvisors
                  .slice(1)
                  .map((teacher) => nameJoiner(locale, teacher.name))
                  .join(", ")}
              >
                {classItem.classAdvisors.length > 1 &&
                  `+${classItem.classAdvisors.length - 1}`}
              </abbr>
            </td>

            {/* Academic year */}
            <td>{getLocaleYear(locale, classItem.year)}</td>

            {/* Actions */}
            {setShowEdit && setEditingClass && setShowConfDel && (
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    name={t("classList.table.action.edit")}
                    type="text"
                    icon={<MaterialIcon icon="edit" />}
                    iconOnly
                    onClick={() => {
                      setShowEdit(true);
                      setEditingClass(classItem);
                    }}
                  />
                  <Button
                    type="text"
                    icon={<MaterialIcon icon="delete" />}
                    iconOnly
                    isDangerous
                    onClick={() => {
                      setShowConfDel(true);
                      setEditingClass(classItem);
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

export default ClassTable;
