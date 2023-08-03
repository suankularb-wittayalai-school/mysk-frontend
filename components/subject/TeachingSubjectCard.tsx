// External libraries
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// SK Components
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

// Internal components
import SubjectClassesDialog from "@/components/subject/SubjectClassesDialog";

// Helpers
import { getLocaleString } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { SubjectClassrooms } from "@/utils/types/subject";

const TeachingSubjectCard: FC<{
  subject: SubjectClassrooms;
}> = ({ subject }) => {
  const locale = useLocale();
  const { t } = useTranslation(["teach", "common"]);

  // Dialog control
  const [classesOpen, setClassesOpen] = useState<boolean>(false);

  return (
    <>
      <Card appearance="outlined">
        <div className="flex flex-row items-center pr-3">
          <CardHeader
            title={getLocaleString(subject.subject.name, locale)}
            subtitle={getLocaleString(subject.subject.code, locale)}
            className="grow"
          />
          {subject.classrooms.length !== 0 && (
            <Button
              appearance="text"
              icon={<MaterialIcon icon="open_in_full" />}
              alt={t("subjects.action.seeDetails")}
              onClick={() => setClassesOpen(true)}
            />
          )}
        </div>
        <CardContent>
          {subject.classrooms.length ? (
            <ChipSet>
              {subject.classrooms.map((classItem) => (
                <InputChip key={classItem.id}>
                  {t("class", { ns: "common", number: classItem.number })}
                </InputChip>
              ))}
            </ChipSet>
          ) : (
            <Actions align="full" className="!mt-0">
              <Button appearance="filled" onClick={() => setClassesOpen(true)}>
                {t("subjects.action.setUp")}
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
