import CheerAttendanceCard from "@/components/cheer/CheerAttendanceCard";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useListDetail from "@/utils/helpers/search/useListDetail";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
  CheerPracticeSession,
  CheerTallyCount,
  ClassroomCheerAttendance,
} from "@/utils/types/cheer";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  Progress,
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
import getAdvisingClassroomID from "@/utils/backend/person/getAdvisingClassroomID";
import { getTeacherFromUserID } from "@/utils/backend/account/getLoggedInPerson";
import { supabase } from "@/utils/supabase-backend";
import getCheerTeacher from "@/utils/backend/attendance/cheer/getCheerTeacher";

const CheerAttendancePage: CustomPage<{
  cheerSession: CheerPracticeSession;
  date: string;
  cheerTeachers: { teacher_id: string }[];
}> = ({ cheerSession, date, cheerTeachers }) => {
  const { t } = useTranslation("attendance/cheer");
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const cacheRef = useRef<Record<string, CheerAttendanceRecord[]>>({});
  const [attendances, setAttendances] = useState<CheerAttendanceRecord[]>([]);
  const [cheerTallyCounts, setCheerTallyCounts] = useState<CheerTallyCount[]>(
    [],
  );
  const [cheerFilteredClass, setcheerFilteredClass] = useState<
    ClassroomCheerAttendance[]
  >([]);

  const cheerTeacherSet = new Set(
    cheerTeachers.map((teacher) => teacher.teacher_id),
  );

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<Pick<Classroom, "id" | "number" | "main_room">>(
    cheerFilteredClass,
    undefined,
    {
      firstByDefault: false,
      dialogBreakpoints: [Breakpoint.base, Breakpoint.sm],
    },
  );

  useEffect(() => {
    if (!mysk.user) return;
    const filterPeriod = async () => {
      const { data: isJatuDay, error: isJatuDayError } = await mysk.fetch<
        (CheerPracticePeriod & { classrooms: string[] })[]
      >(`/v1/attendance/cheer/in-jaturamitr-period`, {
        query: {
          fetch_level: "default",
        },
      });
      if (isJatuDayError) logError("CheerPeriodPage", isJatuDayError);

      setListLoading(true);
      if (mysk.user?.role == "teacher") {
        const { data: teacher } = await getTeacherFromUserID(
          supabase,
          mysk,
          mysk.user.id,
        );
        if (!cheerTeacherSet.has(teacher!.id) && !isJatuDay) {
          const { data: advisingClassroomID } = await getAdvisingClassroomID(
            supabase,
            teacher!.id,
          );
          const filter = cheerSession.classrooms.filter(
            (classroom) => classroom.id == advisingClassroomID,
          );
          setcheerFilteredClass(filter);
        } else {
          setcheerFilteredClass(cheerSession.classrooms);
        }
      } else {
        setcheerFilteredClass(cheerSession.classrooms);
      }
      setListLoading(false);
    };

    filterPeriod();
  }, [mysk.user, cheerSession]);

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
      let [selectedClassroom] = cheerFilteredClass.filter(
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
      <Progress
        appearance="linear"
        visible={listLoading}
        alt="loading"
        className=""
      />
      <SplitLayout ratio="list-detail">
        <LookupListSide length={cheerFilteredClass.length}>
          {!listLoading && (
            <LookupResultsList
              length={cheerFilteredClass.length}
              className="[&>ul]:!gap-8 [&>ul]:!pt-0"
            >
              <LayoutGroup>
                {/* Classrooms grouped by grade */}
                {Object.entries(
                  group(cheerFilteredClass, (classroom) =>
                    Math.floor(classroom.number / 100),
                  ) as Record<string, typeof cheerFilteredClass>,
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
          )}
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
              length={cheerFilteredClass.length}
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

  const { data: rawCheerSession, error: fetchSessionError } = await mysk.fetch<
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

  const DetailClassrooms = await Promise.all(
    rawCheerSession.classrooms.map(async (classroomID) => {
      const { data: detailClassroom } = await getClassroomByID(
        supabase,
        classroomID,
      );
      return detailClassroom!;
    }),
  );

  const cheerSession: CheerPracticeSession = {
    ...rawCheerSession,
    classrooms: rawCheerSession.classrooms
      .map((classroomID) => ({
        ...DetailClassrooms.find((classroom) => classroom.id === classroomID)!,
        attendances: [],
      }))
      .sort((a, b) => a.number - b.number),
  };
  const { data: cheerTeachers } = await getCheerTeacher(supabase);
  return {
    props: { cheerSession, cheerTeachers, date },
    revalidate: 120,
  };
};

export default CheerAttendancePage;
