// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useEffect, useState } from "react";

// SK Components
import {
  Card,
  CardHeader,
  ChipRadioGroup,
  Header,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { IndividualOnboardingStatus } from "@utils/types/admin";
import { DatabaseClient, LangCode } from "@utils/types/common";
import { Role } from "@utils/types/person";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { Database } from "@utils/types/supabase";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const StatisticsSection: FC<{
  statistics: {
    teacher: {
      complete: number;
      full: number;
    };
    student: {
      complete: number;
      full: number;
    };
  };
}> = ({ statistics }) => {
  const { t } = useTranslation("admin");
  const [countType, setCountRequest] = useState<"complete" | "incomplete">(
    "complete"
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="data_usage" allowCustomSize />}
        text={t("onboarding.stats.title")}
      />
      <ChipRadioGroup
        choices={[
          { id: "complete", name: t("onboarding.stats.chip.complete") },
          { id: "incomplete", name: t("onboarding.stats.chip.incomplete") },
        ]}
        onChange={setCountRequest}
        required
        value="complete"
      />
      <LayoutGridCols cols={2}>
        {["teacher", "student"].map((role) => (
          <Card key={role} type="stacked" appearance="outlined">
            <CardHeader
              title={
                <h3>{t(`onboarding.stats.${role}.title.${countType}`)}</h3>
              }
            />
            <p className="px-4 pb-2 font-display">
              <span className="text-6xl font-bold">
                {countType == "incomplete"
                  ? statistics[role as Role].full -
                    statistics[role as Role].complete
                  : statistics[role as Role].complete}
              </span>
              <span className="text-4xl">/</span>
              <span className="text-xl">
                {t(`onboarding.stats.${role}.count`, {
                  count: statistics[role as Role].full,
                })}
              </span>
            </p>
          </Card>
        ))}
      </LayoutGridCols>
    </Section>
  );
};

const IndividualStatusCard: FC<{ teacher: IndividualOnboardingStatus }> = ({
  teacher,
}) => {
  const { t } = useTranslation("admin");

  return (
    <Card type="horizontal" appearance="tonal">
      <CardHeader
        title={<h3 className="!break-all">{teacher.name}</h3>}
        label={
          <div className="!flex flex-row items-center gap-1">
            {teacher.passwordSet ? (
              <>
                <MaterialIcon icon="password" className="text-primary" />
                <span>{t("onboarding.status.status.passwordSet")}</span>
              </>
            ) : teacher.dataChecked ? (
              <>
                <MaterialIcon icon="badge" className="text-primary" />
                <span>{t("onboarding.status.status.dataChecked")}</span>
              </>
            ) : (
              <>
                <MaterialIcon icon="block" className="text-primary" />
                <span>{t("onboarding.status.status.noneCompleted")}</span>
              </>
            )}
          </div>
        }
      />
    </Card>
  );
};

const IndividualStatusSection: FC = () => {
  const { t } = useTranslation("admin");

  const teachers: IndividualOnboardingStatus[] = [
    {
      id: 1,
      name: "จอห์น โด",
      dataChecked: true,
      passwordSet: false,
    },
  ];

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="group" allowCustomSize />}
        text={t("onboarding.status.title.teacher")}
      />
      <LayoutGridCols cols={3}>
        <ul className="contents">
          <LayoutGroup>
            <AnimatePresence initial={false}>
              {teachers.map((teacher) => (
                <motion.li
                  key={teacher.id}
                  initial={{ scale: 0.8, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, y: 20, opacity: 0 }}
                  layoutId={`teacher-${teacher.id}`}
                  transition={animationTransition}
                >
                  <IndividualStatusCard teacher={teacher} />
                </motion.li>
              ))}
            </AnimatePresence>
          </LayoutGroup>
        </ul>
      </LayoutGridCols>
    </Section>
  );
};

const OnboardingStatus: NextPage<{
  statistics: {
    teacher: {
      complete: number;
      full: number;
    };
    student: {
      complete: number;
      full: number;
    };
  };
}> = ({ statistics }) => {
  const { t } = useTranslation("admin");
  const supabase = useSupabaseClient<DatabaseClient>();

  const [currentStatistic, setStatistics] = useState<{
    teacher: {
      complete: number;
      full: number;
    };
    student: {
      complete: number;
      full: number;
    };
  }>(statistics);

  useEffect(() => {
    // listen to onboarding status changes with supabase realtime and rls
    const users = supabase
      .channel("onboarding_status:*")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: 'role=eq."teacher"',
        },
        (payload) => {
          // console.log("Change received!", payload);
          // map the payload to the statistics where onboard are false
          if (payload.new.role == '"teacher"') {
            if (payload.new.onboarded && !payload.old.onboarded) {
              setStatistics((prev) => ({
                ...prev,
                teacher: {
                  ...prev.teacher,
                  complete: prev.teacher.complete + 1,
                },
              }));
            } else {
              setStatistics((prev) => ({
                ...prev,
                teacher: {
                  ...prev.teacher,
                  complete: prev.teacher.complete - 1,
                },
              }));
            }
          } else if (payload.new.role == '"student"') {
            if (payload.new.onboarded && !payload.old.onboarded) {
              setStatistics((prev) => ({
                ...prev,
                student: {
                  ...prev.student,
                  complete: prev.student.complete + 1,
                },
              }));
            } else {
              setStatistics((prev) => ({
                ...prev,
                student: {
                  ...prev.student,
                  complete: prev.student.complete - 1,
                },
              }));
            }
          }
        }
      )
      .subscribe();
    return () => {
      users.unsubscribe();
    };
  }, []);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("onboarding.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("onboarding.title") }}
            pageIcon={<MaterialIcon icon="waving_hand" />}
            backGoesTo="/admin"
            LinkElement={Link}
          />
        }
      >
        <StatisticsSection statistics={currentStatistic} />
        <IndividualStatusSection />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuth({
  async getServerSideProps({ locale }, supabase) {
    // get teacher and student count who have onboarded
    const {
      data: teacherOnboarded,
      error: teacherOnboardedError,
      count: teacherOnboardedCount,
    } = await (supabase as DatabaseClient)
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", '"teacher"')
      .eq("onboarded", true);

    const {
      data: studentOnboarded,
      error: studentOnboardedError,
      count: studentOnboardedCount,
    } = await (supabase as DatabaseClient)
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", '"student"')
      .eq("onboarded", true);

    // get teacher and student count who have not onboarded
    const {
      data: teacherNotOnboarded,
      error: teacherNotOnboardedError,
      count: teacherNotOnboardedCount,
    } = await (supabase as DatabaseClient)
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", '"teacher"')
      .eq("onboarded", false);

    const {
      data: studentNotOnboarded,
      error: studentNotOnboardedError,
      count: studentNotOnboardedCount,
    } = await (supabase as DatabaseClient)
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", '"student"')
      .eq("onboarded", false);

    // format into statistics
    const statistics = {
      teacher: {
        complete: teacherOnboardedCount!,
        full: teacherOnboardedCount! + teacherNotOnboardedCount!,
      },
      student: {
        complete: studentOnboardedCount!,
        full: studentOnboardedCount! + studentNotOnboardedCount!,
      },
    };

    return {
      props: {
        ...(await serverSideTranslations(locale as LangCode, [
          "common",
          "admin",
          "account",
        ])),
        statistics,
      },
    };
  },
});

export default OnboardingStatus;

