import Head from "next/head";
import { CustomPage } from "@/utils/types/common";
import PageHeader from "@/components/common/PageHeader";
import { ContentLayout, List, Text } from "@suankularb-components/react";
import CheerAttendanceEventTabs from "@/components/cheer/CheerAttendanceEventTabs";
import StudentCheerAttendanceListItem from "@/components/cheer/StudentCheerAttendanceListItem";
import cn from "@/utils/helpers/cn";
import {
  CheerAttendanceRecord,
  CheerAttendanceEvent,
  CheerPracticePeriod,
} from "@/utils/types/cheer";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { Student } from "@/utils/types/person";
import { BackendReturn } from "@/utils/types/backend";
import CheerAttendanceRemedialGuidelineGlance from "@/components/home/glance/CheerAttendanceRemedialGuidelineGlance";

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
        <div className={cn(`lg:w-[calc((10/12*100%)-3rem)]`)}>
          <CheerAttendanceRemedialGuidelineGlance className="mb-8" />
          <div
            className={cn(
              `flex flex-col md:h-[calc(100dvh-12rem-2px)] md:overflow-auto md:rounded-lg md:border-1 md:border-outline-variant md:bg-surface-container-high [&>:first-child]:top-0 [&>:first-child]:z-10 [&>:first-child]:sm:sticky [&>:first-child]:sm:bg-surface`,
              attendances.length == 0 && "h-screen",
            )}
          >
            <CheerAttendanceEventTabs
              event={event}
              onEventChange={setEvent}
              className="!h-fit !max-w-none"
            />
            {attendances.length == 0 && (
              <div className="m-auto grid place-content-center">
                <Text
                  type="body-medium"
                  element="p"
                  className="text-center text-on-surface-variant"
                >
                  {t("empty.student")}
                </Text>
              </div>
            )}
            {attendances.length > 0 && (
              <List
                className={cn(
                  `!mt-1 *:bg-surface sm:!-mx-4 md:!m-0 md:space-y-1 md:!p-2 *:md:rounded-md`,
                )}
              >
                {attendances.map((attendance) => (
                  <StudentCheerAttendanceListItem
                    key={attendance.practice_period.id}
                    attendance={attendance}
                    event={event}
                  />
                ))}
              </List>
            )}
          </div>
        </div>
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
  let formattedAttendances: CheerAttendanceRecord[] = [];
  const { data: practicePeriods } = await mysk.fetch<CheerPracticePeriod[]>(
    "/v1/attendance/cheer/periods",
    {
      query: {
        fetch_level: "compact",
        filter: { data: { classroom_id: student.classroom!.id } },
        sort: { by: ["date"], ascending: true },
      },
    },
  );
  if (!practicePeriods) return { notFound: true };
  const { data: attendances } = await mysk.fetch<CheerAttendanceRecord[]>(
    `/v1/students/${student.id}/attendance/cheer`,
    {
      query: { fetch_level: "detailed", descendant_fetch_level: "id_only" },
    },
  );
  if (!attendances) return { notFound: true };
  for (const period of practicePeriods) {
    const existing = attendances?.find(
      (attendance) => attendance.practice_period.id == period.id,
    );
    if (existing) {
      formattedAttendances.push({ ...existing, practice_period: period });
    } else {
      formattedAttendances.push({
        practice_period: period,
        student: student,
        presence: null,
        absence_reason: null,
        presence_at_end: null,
      });
    }
  }
  return { props: { attendances: formattedAttendances } };
};

export default CheerPage;
