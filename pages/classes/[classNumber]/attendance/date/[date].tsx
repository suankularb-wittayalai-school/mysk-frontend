import AttendanceBulkActions from "@/components/attendance/AttendanceBulkActions";
import AttendanceEventTabs from "@/components/attendance/AttendanceEventTabs";
import AttendanceListItem from "@/components/attendance/AttendanceListItem";
import AttendanceStatisticsDialog from "@/components/attendance/AttendanceStatisticsDialog";
import AttendanceViewSelector, {
  AttendanceView,
} from "@/components/attendance/AttendanceViewSelector";
import HomeroomContentDialog from "@/components/attendance/HomeroomContentDialog";
import TodaySummary from "@/components/attendance/TodaySummary";
import PageHeader from "@/components/common/PageHeader";
import getAttendanceOfClass from "@/utils/backend/attendance/getAttendanceOfClass";
import getHomeroomOfClass from "@/utils/backend/attendance/getHomeroomOfClass";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import { YYYYMMDDRegex } from "@/utils/patterns";
import { supabase } from "@/utils/supabase-backend";
import {
  AttendanceEvent,
  HomeroomContent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  Button,
  Columns,
  ContentLayout,
  List,
  MaterialIcon,
} from "@suankularb-components/react";
import { isFuture, isToday, isWeekend } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import { replace } from "radash";
import { useEffect, useState } from "react";

/**
 * Date Attendance page displays Attendance of a Classroom at specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param attendances The Attendance data to display.
 * @param homeroomContent An object containing the content of this day’s homeroom.
 * @param classroom The Classroom that this page is for.
 */
const DateAttendancePage: CustomPage<{
  date: string;
  attendances: StudentAttendance[];
  homeroomContent?: HomeroomContent;
  classroom: Pick<Classroom, "id" | "number">;
}> = ({
  date,
  attendances: initialAttendances,
  homeroomContent,
  classroom,
}) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const mysk = useMySKClient();

  const [event, setEvent] = useState<AttendanceEvent>("assembly");
  const [homeroomOpen, setHomeroomOpen] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);

  const [loading, toggleLoading] = useToggle();

  const [attendances, setAttendances] =
    useState<StudentAttendance[]>(initialAttendances);
  useEffect(() => setAttendances(initialAttendances), [initialAttendances]);

  /** Admin Teachers and Advisors of this Classroom can edit Attendance. */
  const editable =
    (mysk.user?.role === UserRole.teacher &&
      (mysk.user?.is_admin ||
        (mysk.person &&
          classroomOfPerson(mysk.person)?.id === classroom.id))) ||
    false;

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", { classNumber: classroom.number }),
          })}
        </title>
      </Head>
      <PageHeader parentURL="/classes">
        {t("title", { classNumber: classroom.number })}
      </PageHeader>
      <ContentLayout className="*:lg:!items-center">
        <AttendanceViewSelector
          view={AttendanceView.date}
          date={date}
          classroom={classroom}
          className="mx-4 -mb-2 sm:mx-0 lg:w-full"
        >
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="bar_chart" />}
            alt={t("action.statistics")}
            onClick={() => {
              setStatisticsOpen(true);
              plausible("Open School-wide Attendance Statistics");
            }}
          >
            {t("viewSelector.action.statistics")}
          </Button>
          <AttendanceStatisticsDialog
            open={statisticsOpen}
            date={date}
            onClose={() => setStatisticsOpen(false)}
          />
        </AttendanceViewSelector>
        <Columns
          columns={2}
          className={cn(`!grid-cols-1 md:!grid-cols-2
            lg:w-[calc((10/12*100%)-3rem)]`)} // 10 out of 12 columns; 2 gutters
        >
          <div
            className={cn(`grid md:h-[calc(100dvh-12rem-2px)] md:overflow-auto
              md:rounded-lg md:border-1 md:border-outline-variant
              md:bg-surface-container-high [&>:first-child]:top-0
              [&>:first-child]:z-10 [&>:first-child]:sm:sticky
              [&>:first-child]:sm:bg-surface`)}
          >
            <AttendanceEventTabs
              event={event}
              onEventChange={setEvent}
              className="!-mt-2 sm:!mt-0"
            />
            {event === "homeroom" && (
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="edit" />}
                onClick={() => {
                  setHomeroomOpen(true);
                  plausible("Open Homeroom Content", {
                    props: {
                      isToday: isToday(new Date(date)),
                      classroom: `M.${classroom.number}`,
                    },
                  });
                }}
                className="!mx-4 !mt-3 sm:!mx-0 md:!hidden"
              >
                {t("day.action.editHomeroom")}
              </Button>
            )}
            <HomeroomContentDialog
              open={homeroomOpen}
              homeroomContent={
                homeroomContent || { id: null, date, homeroom_content: "" }
              }
              classroomID={classroom.id}
              onClose={() => setHomeroomOpen(false)}
            />
            <List
              className={cn(
                loading && `*:*:animate-pulse`,
                `!mt-1 *:bg-surface sm:!-mx-4 md:!m-0 md:space-y-1 md:!p-2
                *:md:rounded-md`,
              )}
            >
              {attendances.map((attendance) => (
                <AttendanceListItem
                  key={attendance.student.id}
                  attendance={attendance}
                  shownEvent={event}
                  date={date}
                  teacherID={mysk.person?.id}
                  editable={editable && !loading}
                  onAttendanceChange={(attendance) =>
                    setAttendances(
                      replace(
                        attendances,
                        attendance,
                        (item) => attendance.student!.id === item.student!.id,
                      ),
                    )
                  }
                />
              ))}

              {/* Bulk actions (as requested by Supannee) */}
              {editable && mysk.person && (
                <AttendanceBulkActions
                  attendances={attendances}
                  onAttendancesChange={setAttendances}
                  toggleLoading={toggleLoading}
                  date={date}
                  classroom={classroom}
                  teacherID={mysk.person?.id}
                  className="mt-2 px-4 md:px-0"
                />
              )}
            </List>
          </div>
          <TodaySummary
            attendances={attendances}
            homeroomContent={
              homeroomContent || { id: null, date, homeroom_content: "" }
            }
            classroomID={classroom.id}
            className="hidden md:block"
          />
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { classNumber, date } = params as { [key: string]: string };
  if (
    !YYYYMMDDRegex.test(date) ||
    isFuture(new Date(date)) ||
    isWeekend(new Date(date))
  )
    return { notFound: true };

  const { data: classroom, error } = await getClassroomByNumber(
    supabase,
    Number(classNumber),
  );
  if (error) return { notFound: true };

  const { data: attendances } = await getAttendanceOfClass(
    supabase,
    classroom.id,
    date,
  );
  const { data: homeroomContent } = await getHomeroomOfClass(
    supabase,
    classroom.id,
    date,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      date,
      attendances,
      homeroomContent,
      classroom,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default DateAttendancePage;
