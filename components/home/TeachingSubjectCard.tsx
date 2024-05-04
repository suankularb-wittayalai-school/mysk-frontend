import SubjectClassesDialog from "@/components/home/SubjectClassesDialog";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectClassrooms } from "@/utils/types/subject";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  ChipSet,
  InputChip,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * The Teach page counterpart to Classroom Subject Card. Lists the Classrooms
 * this Teacher teaches this Subject to.
 *
 * @param subject The Subject and its Classrooms.
 */
const TeachingSubjectCard: StylableFC<{
  subject: SubjectClassrooms;
}> = ({ subject, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("teach", { keyPrefix: "subjects" });
  const { t: tx } = useTranslation("common");

  const [classesOpen, setClassesOpen] = useState(false);

  return (
    <>
      <Card appearance="filled" style={style} className={className}>
        <div className="flex grow flex-row items-start pr-3">
          <CardHeader
            title={getLocaleString(subject.subject.name, locale)}
            subtitle={getLocaleString(subject.subject.code, locale)}
            className="grow"
          />
          {subject.classrooms.length !== 0 && (
            <Button
              appearance="text"
              icon={<MaterialIcon icon="edit" />}
              alt={t("action.seeDetails")}
              onClick={() => setClassesOpen(true)}
              className="!my-4"
            />
          )}
        </div>
        <CardContent className="!p-3 !pt-0">
          {subject.classrooms.length ? (
            <ChipSet>
              {subject.classrooms.map((classItem) => (
                <InputChip key={classItem.id}>
                  {tx("class", { number: classItem.number })}
                </InputChip>
              ))}
            </ChipSet>
          ) : (
            <Actions className="!-mt-2.5">
              <Button appearance="filled" onClick={() => setClassesOpen(true)}>
                {t("action.setUp")}
              </Button>
            </Actions>
          )}
        </CardContent>
      </Card>

      <SubjectClassesDialog
        open={classesOpen}
        onClose={() => setClassesOpen(false)}
        subject={subject.subject}
      />
    </>
  );
};

export default TeachingSubjectCard;
