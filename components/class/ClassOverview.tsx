// External libraries
import Link from "next/link";
import { FC } from "react";

// SK Components
import {
  Card,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  Section,
  useBreakpoint,
} from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";

const ClassOverview: FC<{ classItem: ClassOverviewType }> = ({ classItem }) => {
  const locale = useLocale();

  const { atBreakpoint } = useBreakpoint();

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
              href={
                atBreakpoint === "base"
                  ? `/lookup/person/teacher/${teacher.id}`
                  : `/lookup/person?id=${teacher.id}&role=teacher`
              }
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
