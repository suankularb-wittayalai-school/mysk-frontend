import CheerAttendanceCard from "@/components/cheer/CheerAttendanceCard";
import CheerDateSelector from "@/components/cheer/CheerDateSelector";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useListDetail from "@/utils/helpers/search/useListDetail";
import {
  CheerAttendanceRecord,
  CheerPracticeSession,
} from "@/utils/types/cheer";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  SplitLayout,
  Text,
  transition,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group, sort } from "radash";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";
import CheerGradeSection from "@/components/cheer/CheerGradeSection";
import React from "react";
import getCheerAttendanceOfClass from "@/utils/backend/attendance/getCheerAttendanceOfClass";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import { Breakpoint } from "@/utils/helpers/useBreakpoint";

const DateCheerAttendancePage: CustomPage<{
  cheerSession: CheerPracticeSession[];
  date: string;
}> = ({ cheerSession, date }) => {
  const { t } = useTranslation("attendance/cheer");

  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSessionID, setSelectedSessionID] = useState<string>("");

  const cacheRef = useRef<Record<string, CheerAttendanceRecord[]>>({});
  const [attendances, setAttendances] = useState<CheerAttendanceRecord[]>([]);
  //useEffect(() => setAttendances(initialAttendances), [initialAttendances]);

  const allSessionClassrooms = cheerSession.flatMap((s) =>
    s.classrooms.map((r) => r.classroom),
  );

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    refreshDetail,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<Pick<Classroom, "id" | "number" | "main_room">>(
    allSessionClassrooms,
    undefined,
    {
      firstByDefault: false,
      dialogBreakpoints: [Breakpoint.base, Breakpoint.sm],
    },
  );

  const fetchIdRef = useRef(0);
  useEffect(() => {
    if (!selectedID || !selectedSessionID) {
      setAttendances([]);
      return;
    }

    const key = `${selectedSessionID}__${selectedID}`;
    if (cacheRef.current[key]) {
      setAttendances(cacheRef.current[key]!);
      return;
    }

    const thisFetchId = ++fetchIdRef.current;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await getCheerAttendanceOfClass(
          selectedSessionID,
          selectedID,
          mysk,
          supabase,
        );

        if (!error && data) {
          cacheRef.current[key] = data;
          // only show if this is the latest fetch
          if (thisFetchId !== fetchIdRef.current) return;
          setAttendances(data);
        }
      } finally {
        // only turn loading off if this is still the latest fetch
        if (thisFetchId === fetchIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedID, selectedSessionID]);

  return (
    <>
      <Head>
        <title>{t("header.staff")}</title>
      </Head>
      <PageHeader>{t("title.staff")}</PageHeader>
      <SplitLayout ratio="list-detail">
        <LookupListSide length={allSessionClassrooms.length}>
          <CheerDateSelector date={date} />
          <LookupResultsList
            length={allSessionClassrooms.length}
            className="[&>ul]:!gap-8 [&>ul]:!pt-0"
          >
            <LayoutGroup>
              {/* Classrooms grouped by grade */}
              {cheerSession.map((session) => {
                // Period
                const period = session.start_time + " - " + session.duration;
                const byGrade = group(session.classrooms, (item) =>
                  Math.floor(item.classroom.number / 100).toString(),
                ) as Record<string, typeof session.classrooms>;
                return (
                  <React.Fragment key={session.id}>
                    {sort(Object.entries(byGrade), ([grade]) =>
                      Number(grade),
                    ).map(([grade, records]) => {
                      const classroomList = records.map((r) => r.classroom);
                      const countList = records.map((r) => r.count);
                      return (
                        <CheerGradeSection
                          key={session.id + grade}
                          layoutId={session.id + grade}
                          grade={grade}
                          period={period}
                          classrooms={classroomList}
                          count={countList}
                          selectedID={selectedID}
                          onSelectedChange={(classroomID) => {
                            setSelectedSessionID(session.id);
                            onSelectedChange(classroomID);
                            setAttendances([]);
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </LayoutGroup>
          </LookupResultsList>
        </LookupListSide>

        {/* Details */}
        <motion.main
          key={selectedID || "empty"}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={transition(DURATION.medium2, EASING.standardDecelerate)}
          className="relative hidden grow *:absolute *:inset-0 md:block"
        >
          {selectedID != null ? (
            <LookupDetailsSide
              selectedID={selectedDetail?.id || selectedID}
              length={allSessionClassrooms.length}
            >
              <CheerAttendanceCard
                date={date}
                classroom={selectedDetail}
                attendances={attendances}
                onAttendancesChange={setAttendances}
                loading={loading}
              />
            </LookupDetailsSide>
          ) : (
            <div className="grid place-content-center">
              <Text
                type="body-medium"
                element="p"
                className="text-center text-on-surface-variant"
              >
                {t("empty")}
              </Text>
            </div>
          )}
        </motion.main>
      </SplitLayout>
      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <CheerAttendanceCard
          date={date}
          classroom={selectedDetail}
          attendances={attendances}
          onAttendancesChange={setAttendances}
          loading={loading}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
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

  const { data: rawCheerSession } = await mysk.fetch<CheerPracticeSession[]>(
    `/v1/attendance/cheer/periods`,
    {
      query: {
        fetch_level: "detailed",
        descendant_fetch_level: "id_only",
        filter: { data: { date: date } },
      },
    },
  );
  if (!rawCheerSession) return { notFound: true };
  // turn arr -> set -> arr to remove duplicate
  const classroomIDs = Array.from(
    new Set(
      rawCheerSession
        .flatMap((session) => session.classrooms)
        .map((classrooms) => classrooms.classroom.id),
    ),
  );

  const DetailClassrooms = await Promise.all(
    classroomIDs.map(async (id) => {
      const { data: classroom } = await getClassroomByID(supabase, id, {
        includeStudents: true,
      });
      return classroom!;
    }),
  );

  const cheerSession: CheerPracticeSession[] = rawCheerSession.map(
    (session) => ({
      ...session,
      classrooms: session.classrooms.map((cc) => ({
        ...cc,
        classroom: DetailClassrooms.find((c) => c.id === cc.classroom.id)!,
        attendances: cc.attendances,
        count: cc.count,
      })),
    }),
  );

  return {
    props: { cheerSession, date },
  };
};

export default DateCheerAttendancePage;
