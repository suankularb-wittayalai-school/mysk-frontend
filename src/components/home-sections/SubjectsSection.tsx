// Modules
import Link from "next/link";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Header,
  MaterialIcon,
  Section,
  LinkButton,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/schedule/Schedule";

// Types
import { StudentSchedule } from "@utils/types/schedule";

const SubjectsSection = ({
  schedule,
}: {
  schedule: StudentSchedule;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="school" allowCustomSize={true} />}
        text={t("subjects.title")}
      />
      <Schedule schedule={schedule} role="teacher" />
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <LinkButton
          label={t("subjects.action.seeSchedule")}
          type="outlined"
          url="/t/schedule"
          LinkElement={Link}
        />
        <LinkButton
          label={t("subjects.action.seeSubjects")}
          type="filled"
          url="/t/subjects/teaching"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default SubjectsSection;
