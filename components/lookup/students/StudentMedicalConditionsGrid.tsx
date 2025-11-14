import { StylableFC } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";
import { Card, CardHeader, Columns, Text } from "@suankularb-components/react";
import { Student } from "@/utils/types/person";
import useTranslation from "next-translate/useTranslation";

const StudentMedicalConditionsGrid: StylableFC<{ student: Student }> = ({
  student,
  style,
  className,
}) => {
  const { t } = useTranslation("search/students/detail");
  const joinedAllergies = student.allergies?.join(",");
  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text type="title-medium" element="h3" className="px-3">
        {t("medicalConditions.title")}
      </Text>
      <Columns columns={2} className="!gap-2">
        <Card appearance="outlined" direction="row" className="items-center">
          <CardHeader
            title={t("medicalConditions.allergies.title")}
            subtitle={
              joinedAllergies?.length !== 0
                ? joinedAllergies
                : t("medicalConditions.allergies.empty")
            }
          />
        </Card>

        <Card
          appearance="outlined"
          direction="row"
          className="items-center !text-pretty"
        >
          <CardHeader
            title={t("medicalConditions.healthProblem.title")}
            subtitle={
              student.health_problem?.length !== 0
                ? student.health_problem
                : t("medicalConditions.healthProblem.empty")
            }
          />
        </Card>
      </Columns>
    </section>
  );
};

export default StudentMedicalConditionsGrid;
