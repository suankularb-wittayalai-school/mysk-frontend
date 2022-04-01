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
import { Subject } from "@utils/types/subject";

const SubjectCard = ({
  subject,
}: {
  subject: { id: Subject["id"]; code: Subject["code"]; name: Subject["name"] };
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Card type="horizontal" appearance="outlined">
      <CardHeader
        title={<h3>{subject.name[locale].name}</h3>}
        label={<h3>{subject.code[locale]}</h3>}
        end={
          <LinkButton
            label={t("teaching.subjects.seeDetails")}
            type="tonal"
            iconOnly
            icon={<MaterialIcon icon="arrow_right" />}
            url={`/subjects/${subject.id}`}
            LinkElement={Link}
          />
        }
      />
    </Card>
  );
};
