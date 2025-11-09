import { CustomPage } from "@/utils/types/common";
import PageHeader from "@/components/common/PageHeader";
import Head from "next/head";
import { ContentLayout, List, Progress } from "@suankularb-components/react";
import CheerDateSelector from "@/components/cheer/CheerDateSelector";
import cn from "@/utils/helpers/cn";
import CheerPeriodListItem from "@/components/cheer/CheerPeriodListItem";
import { GetStaticPaths, GetStaticProps } from "next";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { CheerPracticePeriod, CheerPracticeSession } from "@/utils/types/cheer";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import logError from "@/utils/helpers/logError";
import { Text } from "@suankularb-components/react";
import getAdvisingClassroomID from "@/utils/backend/person/getAdvisingClassroomID";
import { getTeacherFromUserID } from "@/utils/backend/account/getLoggedInPerson";
import { useEffect, useState } from "react";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabase-backend";
import getCheerTeacher from "@/utils/backend/attendance/cheer/getCheerTeacher";

const CheerPeriodPage: CustomPage<{
  cheerPeriods: CheerPracticeSession[];
  date: string;
  cheerTeachers: string[];
}> = ({ cheerPeriods, date, cheerTeachers }) => {
  const router = useRouter();
  const { t } = useTranslation("attendance/cheer");
  const { t: tx } = useTranslation("attendance/cheer/list");

  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const [cheerFilterdPeriods, setFilterdCheerPeriods] = useState<
    CheerPracticeSession[]
  >([]);
  const [loading, setLoading] = useState(true);

  const cheerTeacherSet = new Set(cheerTeachers.map((teacher) => teacher));

  useEffect(() => {
    if (!mysk.user) return;
    const filterCheerClass = async () => {
      const { data: isJatuDay, error: isJatuDayError } = await mysk.fetch<
        (CheerPracticePeriod & { classrooms: string[] })[]
      >(`/v1/attendance/cheer/in-jaturamitr-period`, {
        query: {
          fetch_level: "default",
        },
      });
      if (isJatuDayError) logError("CheerPeriodPage", isJatuDayError);

      setLoading(true);
      if (mysk.user?.role == "teacher") {
        const { data: teacher } = await getTeacherFromUserID(
          supabase,
          mysk,
          mysk.user.id,
        );
        if (!cheerTeacherSet.has(teacher!.teacher_id!) && !isJatuDay) {
          const { data: advisingClassroomID } = await getAdvisingClassroomID(
            supabase,
            teacher!.id,
          );
          const filtered = cheerPeriods!.filter((period) =>
            (period.classrooms as unknown as string[]).includes(
              advisingClassroomID || "",
            ),
          );
          setFilterdCheerPeriods(filtered);
        }
      } else {
        setFilterdCheerPeriods(cheerPeriods);
      }
      setLoading(false);
    };

    filterCheerClass();
  }, [mysk.user, cheerPeriods]);

  const handleSessionSelect = (id: string) => {
    router.push(`/cheer/attendance/${date}/${id}`);
  };

  return (
    <>
      <Head>
        <title>{t("header.staff")}</title>
      </Head>
      <PageHeader>{t("title.staff")}</PageHeader>
      <ContentLayout className="!pb-0 *:lg:!items-center">
        <div className={cn(`lg:w-[calc((10/12*100%)-3rem)]`)}>
          <div className={cn(`h-[calc(100dvh-5.75rem)]`)}>
            <CheerDateSelector date={date} />
            <div
              className={cn(
                `relative flex h-full flex-col overflow-hidden rounded-lg sm:overflow-auto md:overflow-hidden md:bg-surface-container`,
              )}
            >
              {loading && (
                <div className="flex h-full w-full items-center justify-center">
                  <Progress
                    appearance="circular"
                    visible={loading}
                    alt="loading"
                    className=""
                  />
                </div>
              )}
              {!loading && (
                <div className="h-full">
                  {cheerFilterdPeriods.length !== 0 ? (
                    <List
                      className={cn(
                        `!mt-1 !overflow-y-auto *:bg-none md:!m-0 md:space-y-1 md:!p-2 *:md:rounded-lg *:md:bg-surface`,
                      )}
                    >
                      {cheerFilterdPeriods.map((cheerSession) => (
                        <CheerPeriodListItem
                          key={cheerSession.id}
                          cheerSession={cheerSession}
                          onSessionSelect={handleSessionSelect}
                        />
                      ))}
                    </List>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Text
                        type="body-medium"
                        className="text-center text-on-surface-variant"
                      >
                        {tx("empty")}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const mysk = await createMySKClient();

  const { date } = params as { [key: string]: string };
  const { data: cheerPeriods, error: fetchIdError } = await mysk.fetch<
    (CheerPracticePeriod & { classrooms: string[] })[]
  >(`/v1/attendance/cheer/periods`, {
    query: {
      fetch_level: "compact",
      filter: { data: { date: date } },
    },
  });
  if (fetchIdError) logError("CheerPeriodPage", fetchIdError);
  const { data: cheerTeachers } = await getCheerTeacher(supabase);
  return {
    props: { cheerPeriods, date, cheerTeachers },
    revalidate: 120,
  };
};

export default CheerPeriodPage;
