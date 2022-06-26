// Modules
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

// SK Components
import {
  Card,
  CardActions,
  CardHeader,
  Chip,
  ChipList,
  LinkButton,
} from "@suankularb-components/react";

// Types
import { ClassWNumber } from "@utils/types/class";
import { SubjectWNameAndCode } from "@utils/types/subject";

const SubjectCard = ({
  subject,
}: {
  subject: SubjectWNameAndCode & { classes: ClassWNumber[] };
}): JSX.Element => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Card type="stacked" appearance="outlined">
      <CardHeader
        title={
          <h3 className="break-all font-display text-lg font-bold">
            {(subject.name[locale] || subject.name.th).name}
          </h3>
        }
        label={<span>{subject.code[locale]}</span>}
      />
      <div className="mx-[2px] overflow-x-auto py-1 px-[calc(1rem-2px)]">
        <ChipList noWrap>
          {subject.classes
            .sort((a, b) => a.number - b.number)
            .map((classItem) => (
              <Chip
                key={classItem.id}
                name={t("class", { ns: "common", number: classItem.number })}
              />
            ))}
        </ChipList>
      </div>
      <CardActions>
        <LinkButton
          label={t("teaching.subjects.action.seeDetails")}
          type="tonal"
          url={`/t/subjects/${subject.id}`}
          LinkElement={Link}
        />
      </CardActions>
    </Card>
  );
};

export default SubjectCard;
