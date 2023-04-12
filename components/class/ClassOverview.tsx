// External libraries
import { FC } from "react";

// SK Components
import {
  Card,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  Section,
} from "@suankularb-components/react";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";
import DynamicAvatar from "../common/DynamicAvatar";
import { nameJoiner } from "@/utils/helpers/name";
import { useLocale } from "@/utils/hooks/i18n";
import Link from "next/link";
import { getLocaleString } from "@/utils/helpers/i18n";

const ClassOverview: FC<{ classItem: ClassOverviewType }> = ({ classItem }) => {
  4;
  const locale = useLocale();

  return (
    <ContentLayout>
      <Section>
        <Header>Class advisors</Header>
        <Columns columns={4}>
          {classItem.classAdvisors.map((teacher) => (
            <Card
              key={teacher.id}
              appearance="outlined"
              stateLayerEffect
              href={`/lookup/person/teacher/${teacher.id}`}
              element={Link}
            >
              <CardHeader
                avatar={<DynamicAvatar profile={teacher.profile} />}
                title={nameJoiner(locale, teacher.name)}
                subtitle={getLocaleString(teacher.subjectGroup.name, locale)}
              />
            </Card>
          ))}
        </Columns>
      </Section>
    </ContentLayout>
  );
};

export default ClassOverview;
