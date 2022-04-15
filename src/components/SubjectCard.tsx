// Modules
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

// SK Components
import {
  Card,
  CardHeader,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { SubjectWNameAndCode } from "@utils/types/subject";

const SubjectCard = ({
  subject,
}: {
  subject: SubjectWNameAndCode;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Card type="horizontal" appearance="outlined">
      <CardHeader
        title={
          <h3 className="font-display text-lg font-bold break-all">
            {subject.name[locale].name}
          </h3>
        }
        label={<span>{subject.code[locale]}</span>}
        end={
          <LinkButton
            name={t("teaching.subjects.seeDetails")}
            type="tonal"
            iconOnly
            icon={<MaterialIcon icon="arrow_forward" />}
            url={`/t/subjects/${subject.id}`}
            LinkElement={Link}
          />
        }
      />
    </Card>
  );
};

export default SubjectCard;
