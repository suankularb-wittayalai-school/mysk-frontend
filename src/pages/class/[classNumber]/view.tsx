// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Card,
  CardHeader,
  Header,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ContactChip from "@components/ContactChip";
import TeacherCard from "@components/TeacherCard";

// Backend
import {
  getAllClassNumbers,
  getClassroom,
} from "@utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { Class as ClassType } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Teacher } from "@utils/types/person";

const RelatedPagesSection = ({ classNumber }: { classNumber: number }) => {
  const { t } = useTranslation("class");

  return (
    <Section>
      <LayoutGridCols cols={2}>
        <Link href={`/class/${classNumber}/teachers`}>
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="recent_actors" />}
                title={<h2>{t("links.teacherList.title")}</h2>}
                label={t("links.teacherList.supportingText", { classNumber })}
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
        <Link href={`/class/${classNumber}/students`}>
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="groups" />}
                title={<h2>{t("links.studentList.title")}</h2>}
                label={t("links.studentList.supportingText", { classNumber })}
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
      </LayoutGridCols>
    </Section>
  );
};

const ClassAdvisorsSection = ({
  classAdvisors,
}: {
  classAdvisors: Teacher[];
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-advisors">
      <Header
        icon={<MaterialIcon icon="group" allowCustomSize />}
        text={t("classAdvisors.title")}
      />
      <LayoutGridCols cols={3}>
        {classAdvisors.map((classAdvisor) => (
          <TeacherCard
            key={classAdvisor.id}
            teacher={classAdvisor}
            hasSubjectGroup
          />
        ))}
      </LayoutGridCols>
    </Section>
  );
};

const ContactSection = ({ contacts }: { contacts: Contact[] }): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" allowCustomSize />}
        text={t("classContacts.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {contacts.map((contact) => (
          <ContactChip
            key={contact.id}
            contact={contact}
            className="!w-initial"
          />
        ))}
      </div>
    </Section>
  );
};

// Page
const Class: NextPage<{ classNumber: number; classItem: ClassType }> = ({
  classNumber,
  classItem,
}) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("class", { number: classItem.number }), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("class", { number: classItem.number }) }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/learn"
            LinkElement={Link}
          />
        }
      >
        <RelatedPagesSection classNumber={classNumber} />
        <ClassAdvisorsSection classAdvisors={classItem.classAdvisors} />
        <ContactSection contacts={classItem.contacts} />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  const classItem = await getClassroom(classNumber);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "teacher",
      ])),
      classNumber,
      classItem,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers()).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default Class;
