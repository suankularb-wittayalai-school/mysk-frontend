import Head from "next/head";
import { CustomPage } from "@/utils/types/common";
import PageHeader from "@/components/common/PageHeader";
import { ContentLayout, Columns, List } from "@suankularb-components/react";
import CheerAttendanceEventTabs from "@/components/cheer/CheerAttendanceEventTabs";
import StudentCheerAttendanceListItem from "@/components/cheer/StudentCheerAttendanceListItem";
import cn from "@/utils/helpers/cn";
import {
  CheerAttendanceRecord,
  CheerAttendanceEvent,
} from "@/utils/types/cheer";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { Student } from "@/utils/types/person";
import { BackendReturn } from "@/utils/types/backend";

const CheerPage: CustomPage<{
  attendances: CheerAttendanceRecord[];
}> = ({ attendances }) => {
  const [event, setEvent] = useState<CheerAttendanceEvent>("start");
  const { t } = useTranslation("attendance/cheer");
  const { t: tx } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title.student") })}</title>
      </Head>
      <PageHeader parentURL="/learn">{t("header.student")}</PageHeader>
      <ContentLayout className="*:lg:!items-center">
        <Columns
          columns={2}
          className={cn(
            `!grid-cols-1 md:!grid-cols-2 lg:w-[calc((10/12*100%)-3rem)]`,
          )} // 10 out of 12 columns; 2 gutters
        >
          <div
            className={cn(
              `md:h-[calc(100dvh-12rem-2px)] md:overflow-auto md:rounded-lg md:border-1 md:border-outline-variant md:bg-surface-container-high [&>:first-child]:top-0 [&>:first-child]:z-10 [&>:first-child]:sm:sticky [&>:first-child]:sm:bg-surface`,
            )}
          >
            <CheerAttendanceEventTabs
              event={event}
              onEventChange={setEvent}
              className="!h-fit"
            />
            <List
              className={cn(
                `!mt-1 *:bg-surface sm:!-mx-4 md:!m-0 md:space-y-1 md:!p-2 *:md:rounded-md`,
              )}
            >
              {attendances?.map((attendance) => (
                <StudentCheerAttendanceListItem
                  key={attendance.id}
                  attendance={attendance}
                  event={event}
                />
              ))}
            </List>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const { data: student } = (await getLoggedInPerson(supabase, mysk, {
    detailed: true,
  })) as BackendReturn<Student>;
  if (!student) return { notFound: true };
  const { data: attendances } = await mysk.fetch<CheerAttendanceRecord[]>(
    `/v1/students/${student.id}/attendance/cheer`,
    {
      query: { fetch_level: "detailed", descendant_fetch_level: "default" },
    },
  );
  return { props: { attendances } };
};

export default CheerPage;
