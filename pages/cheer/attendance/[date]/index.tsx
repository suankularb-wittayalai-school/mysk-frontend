import { CustomPage } from "@/utils/types/common";
import PageHeader from "@/components/common/PageHeader";
import Head from "next/head";
import { ContentLayout, List } from "@suankularb-components/react";
import CheerDateSelector from "@/components/cheer/CheerDateSelector";
import cn from "@/utils/helpers/cn";
import CheerPeriodListItem from "@/components/cheer/CheerPeriodListItem";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { CheerPracticeSession } from "@/utils/types/cheer";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import logError from "@/utils/helpers/logError";
import { Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import getAdvisingClass from "@/utils/backend/person/getAdvisingClass";
import { getTeacherFromUserID } from "@/utils/backend/account/getLoggedInPerson";

const CheerPeriodPage: CustomPage<{
  cheerPeriods: CheerPracticeSession[];
  date: string;
}> = ({ cheerPeriods, date }) => {
  const router = useRouter();
  const { t } = useTranslation("attendance/cheer");
  const { t: tx } = useTranslation("attendance/cheer/list");

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
            <div
              className={cn(
                `relative flex h-full flex-col overflow-hidden rounded-xl sm:overflow-auto md:overflow-hidden md:bg-surface-container`,
              )}
            >
              <CheerDateSelector date={date} />
              {cheerPeriods.length !== 0 ? (
                <List
                  className={cn(
                    `!mt-1 !overflow-y-auto *:bg-none md:!m-0 md:space-y-1 md:!p-1 *:md:rounded-md *:md:bg-surface`,
                  )}
                >
                  {cheerPeriods.map((cheerSession) => (
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
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { date } = params as { [key: string]: string };
  const { data: cheerPeriods, error: fetchIdError } = await mysk.fetch<
    CheerPracticeSession[]
  >(`/v1/attendance/cheer/periods`, {
    query: {
      fetch_level: "compact",
      filter: { data: { date: date } },
    },
  });
  if (fetchIdError) logError("CheerPeriodPage", fetchIdError);
  let filteredCheerPeriods = cheerPeriods;
  if (mysk.user?.role == "teacher") {
    const { data: teacher } = await getTeacherFromUserID(
      supabase,
      mysk,
      mysk.user.id,
    );
    const { data: advisingClassroomID } = await getAdvisingClass(
      supabase,
      teacher!.id,
    );
    filteredCheerPeriods = cheerPeriods!.filter((period) =>
      period.classrooms.some(
        (classroom) => classroom.id === advisingClassroomID,
      ),
    );
  }
  return {
    props: { cheerPeriods: filteredCheerPeriods, date },
  };
};

export default CheerPeriodPage;
