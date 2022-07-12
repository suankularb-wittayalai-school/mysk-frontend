// Modules
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Card,
  CardHeader,
  Chip,
  ChipList,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useSession } from "@utils/hooks/auth";

const DatabaseSection = (): JSX.Element => {
  const { t } = useTranslation("admin");
  const tables = [
    {
      icon: <MaterialIcon icon="groups" />,
      name: "student",
      url: "/t/admin/students",
    },
    {
      icon: <MaterialIcon icon="group" />,
      name: "teacher",
      url: "/t/admin/teachers",
    },
    {
      icon: <MaterialIcon icon="book" />,
      name: "subject",
      url: "/t/admin/subjects",
    },
    {
      icon: <MaterialIcon icon="meeting_room" />,
      name: "classroom",
      url: "/t/admin/classes",
    },
  ];

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="database" allowCustomSize />}
        text={t("database.title")}
      />
      <ul className="layout-grid-cols-3">
        {tables.map((table) => (
          <li key={table.name} aria-labelledby={`table-${table.name}`}>
            <Link href={table.url}>
              <a aria-labelledby={`table-${table.name}`}>
                <Card type="horizontal" appearance="outlined" hasAction>
                  <CardHeader
                    icon={table.icon}
                    title={
                      <h3 id={`table-${table.name}`}>
                        {t(`database.table.${table.name}`)}
                      </h3>
                    }
                    label={<code>{table.name}</code>}
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const ScheduleSection = (): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="dashboard" allowCustomSize />}
        text={t("schedule.title")}
      />
      <ul className="layout-grid-cols-6">
        {range(6).map((grade) => (
          <li key={grade} aria-labelledby={`schedule-${grade}`}>
            <Link
              aria-labelledby={`schedule-${grade}`}
              href={`/t/admin/schedule/${grade + 1}`}
            >
              <a>
                <Card type="horizontal" appearance="outlined" hasAction>
                  <CardHeader
                    title={
                      <h3 id={`schedule-${grade}`}>
                        {t("schedule.gradeItem", { grade: grade + 1 })}
                      </h3>
                    }
                    end={<MaterialIcon icon="arrow_forward" />}
                  />
                </Card>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const Admin: NextPage = () => {
  const { t } = useTranslation(["admin", "common"]);
  useSession({ loginRequired: true, adminOnly: true });

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="security" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <DatabaseSection />
        <ScheduleSection />
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
    },
  };
};

export default Admin;
