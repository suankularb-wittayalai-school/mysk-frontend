import CheerAttendanceCard from "@/components/cheer/CheerAttendanceCard";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useListDetail from "@/utils/helpers/search/useListDetail";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
  CheerPracticeSession,
  CheerTallyCount,
} from "@/utils/types/cheer";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  Snackbar,
  SplitLayout,
  Text,
  transition,
} from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { group, pick } from "radash";
import useTranslation from "next-translate/useTranslation";
import { useContext, useEffect, useRef, useState } from "react";
import CheerGradeSection from "@/components/cheer/CheerGradeSection";
import React from "react";
import getCheerAttendanceOfClass from "@/utils/backend/attendance/cheer/getCheerAttendanceOfClass";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import { Breakpoint } from "@/utils/helpers/useBreakpoint";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import SnackbarContext from "@/contexts/SnackbarContext";
import logError from "@/utils/helpers/logError";
import { supabase } from "@/utils/supabase-client";
import getCheerTeacher from "@/utils/backend/attendance/cheer/getCheerTeacher";
import getMultipleClassroomsByIDs from "@/utils/backend/attendance/cheer/getMultipleClassroomsByIDs";

const CheerAttendancePage: CustomPage<{
  cheerSession: CheerPracticeSession;
  date: string;
}> = ({ cheerSession, date }) => {
  const { t } = useTranslation("attendance/cheer");
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState<boolean>(false);
  const cacheRef = useRef<Record<string, CheerAttendanceRecord[]>>({});
  const [attendances, setAttendances] = useState<CheerAttendanceRecord[]>([]);
  const [cheerTallyCounts, setCheerTallyCounts] = useState<CheerTallyCount[]>(
    [],
  );

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<Pick<Classroom, "id" | "number" | "main_room">>(
    cheerSession.classrooms,
    undefined,
    {
      firstByDefault: false,
      dialogBreakpoints: [Breakpoint.base, Breakpoint.sm],
    },
  );

  const fetchIdRef = useRef(0);
  useEffect(() => {
    if (!selectedID) {
      setAttendances([]);
      return;
    }

    const thisFetchId = ++fetchIdRef.current;
    if (
      cacheRef.current[selectedID] &&
      cacheRef.current[selectedID].length != 0
    ) {
      setAttendances(cacheRef.current[selectedID]);
      onCheerTallyCounts(cacheRef.current[selectedID], selectedID);
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      let [selectedClassroom] = cheerSession.classrooms.filter(
        (classroom) => classroom.id === selectedID,
      );
      try {
        const { data, error } = await getCheerAttendanceOfClass(
          selectedClassroom,
          pick(cheerSession, ["id", "date", "start_time", "end_time", "note"]),
          supabase,
          mysk,
        );

        if (error) {
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        }

        if (!error && data) {
          cacheRef.current[selectedID] = data;
          // only show if this is the latest fetch
          if (thisFetchId !== fetchIdRef.current) return;
          setAttendances(data);
          onCheerTallyCounts(data, selectedID);
        }
      } finally {
        // only turn loading off if this is still the latest fetch
        if (thisFetchId === fetchIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchAttendance();
  }, [selectedID]);

  useEffect(() => {
    if (!selectedID) return;
    cacheRef.current[selectedID] = attendances;
  }, [attendances, selectedID]);

  const onCheerTallyCounts = (
    attendances: CheerAttendanceRecord[],
    classroomID: string,
  ) => {
    let presence = 0;
    let total = attendances.length;

    for (const attendance of attendances) {
      if (attendance.presence === "present" || attendance.presence === "late")
        presence += 1;
    }

    const newTally: CheerTallyCount = {
      id: classroomID,
      count: {
        presence,
        total,
      },
    };

    setCheerTallyCounts((prev) => {
      const other = prev.filter((c) => c.id !== classroomID);
      return [...other, newTally];
    });
  };

  return (
    <>
      <Head>
        <title>{t("header.staff")}</title>
      </Head>
      <PageHeader parentURL={`/cheer/attendance/${date}`}>
        {t("title.staffAttendance", {
          date: new Date(cheerSession.date),
        })}{" "}
        {t("title.time", {
          start: new Date(cheerSession.date + "T" + cheerSession.start_time),
          end: new Date(cheerSession.date + "T" + cheerSession.end_time),
        })}
      </PageHeader>
      <SplitLayout ratio="list-detail">
        <LookupListSide length={cheerSession.classrooms.length}>
          <LookupResultsList
            length={cheerSession.classrooms.length}
            className="[&>ul]:!gap-8 [&>ul]:!pt-0"
          >
            <LayoutGroup>
              {/* Classrooms grouped by grade */}
              {Object.entries(
                group(cheerSession.classrooms, (classroom) =>
                  Math.floor(classroom.number / 100),
                ) as Record<string, typeof cheerSession.classrooms>,
              ).map(([grade, classrooms]) => (
                <CheerGradeSection
                  key={grade}
                  grade={grade}
                  classrooms={classrooms}
                  cheerTallyCounts={cheerTallyCounts}
                  selectedID={selectedID}
                  onSelectedChange={(classroomID) => {
                    onSelectedChange(classroomID);
                    if (classroomID !== selectedID) {
                      setAttendances([]);
                    }
                  }}
                />
              ))}
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
          {selectedID ? (
            <LookupDetailsSide
              selectedID={selectedDetail?.id || selectedID}
              length={cheerSession.classrooms.length}
            >
              <CheerAttendanceCard
                classroom={selectedDetail}
                attendances={attendances}
                onAttendancesChange={setAttendances}
                onCheerTallyCounts={onCheerTallyCounts}
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
                {t("empty.staff")}
              </Text>
            </div>
          )}
        </motion.main>
      </SplitLayout>
      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <CheerAttendanceCard
          classroom={selectedDetail}
          attendances={attendances}
          onAttendancesChange={setAttendances}
          onCheerTallyCounts={onCheerTallyCounts}
          loading={loading}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const mysk = await createMySKClient();

  const { id } = params as { [key: string]: string };
  const { date } = params as { [key: string]: string };

  const { data: cheerSession, error: fetchSessionError } = await mysk.fetch<
    CheerPracticePeriod & { classrooms: string[] }
  >(`/v1/attendance/cheer/periods/${id}`, {
    query: {
      fetch_level: "compact",
    },
  });
  if (fetchSessionError) {
    logError("CheerAttendancePage", fetchSessionError);
    return { notFound: true };
  }

  const { data: detailClassrooms, error: detailClassroomsError } =
    await getMultipleClassroomsByIDs(supabase, cheerSession.classrooms);
  if (detailClassroomsError) {
    logError("CheerAttendancePage", detailClassroomsError);
    return { notFound: true };
  }

  const detailCheerSession: CheerPracticeSession = {
    ...cheerSession,
    classrooms: cheerSession.classrooms
      .map((classroomID) => ({
        ...detailClassrooms.find((classroom) => classroom.id === classroomID)!,
        attendances: [],
      }))
      .sort((a, b) => a.number - b.number),
  };
  const { data: cheerTeachers } = await getCheerTeacher(supabase);
  return {
    props: { cheerSession: detailCheerSession, cheerTeachers, date },
    revalidate: 120,
  };
};

export default CheerAttendancePage;
