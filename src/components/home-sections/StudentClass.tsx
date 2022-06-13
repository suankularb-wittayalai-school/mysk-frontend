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
import { Schedule as ScheduleType } from "@utils/types/schedule";

const StudentClassSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="groups" allowCustomSize={true} />}
        text={t("class.title")}
      />
      <Schedule schedule={schedule} role="student" />
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <LinkButton
          label={t("class.action.seeSchedule")}
          type="outlined"
          url="/s/405/schedule"
          LinkElement={Link}
        />
        <LinkButton
          label={t("class.action.seeClassDetail")}
          type="filled"
          url="/s/405/class"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default StudentClassSection;
