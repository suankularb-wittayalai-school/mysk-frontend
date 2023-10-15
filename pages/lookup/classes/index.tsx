// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import ClassDetailsCard from "@/components/lookup/classes/ClassDetailsCard";
import GradeSection from "@/components/lookup/classes/GradeSection";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import getLookupClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Classroom } from "@/utils/types/classroom";
import { LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import { SplitLayout, useBreakpoint } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LayoutGroup } from "framer-motion";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group } from "radash";
import { useEffect, useMemo, useState } from "react";

/**
 * A Classroom with the Schedule for today.
 */
export type LookupClassItem = Pick<Classroom, "id" | "number" | "main_room"> & {
  relevantPeriod: SchedulePeriod;
};

/**
 * Lookup Classes Page shows a list of all Classrooms in the current academic
 * year. The user can select a Classroom to view its details.
 *
 * The user’s Classroom is selected by default and has the most content
 * revealed. Other Classrooms have minimal information to prevent privacy
 * issues.
 *
 * @param grades The Classrooms grouped by grade.
 * @param userClassroom The Classroom the user is a part of.
 * @param periodNumberAtFetch The current period number at the time of fetching.
 */
const LookupClassesPage: NextPage<{
  grades: {
    [grade: string]: LookupClassItem[];
  };
  userRole: UserRole;
  userClassroom?: LookupClassItem;
  teacherID?: string;
  periodNumberAtFetch: number;
}> = ({ grades, userRole, userClassroom, teacherID, periodNumberAtFetch }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "classes" });
  const { t: tx } = useTranslation("common");

  const refreshProps = useRefreshProps();

  // Refresh the page when the current Period might change
  const currentPeriodNumber = getCurrentPeriod();
  useEffect(() => {
    if (currentPeriodNumber !== periodNumberAtFetch) refreshProps();
  }, [currentPeriodNumber]);

  /**
   * The total number of Classrooms.
   */
  const length = useMemo(() => Object.values(grades).flat().length, [grades]);

  const [selectedID, setSelectedID] = useState<string | undefined>(
    userClassroom?.id || grades[1][0]?.id,
  );

  const supabase = useSupabaseClient();
  const [selectedClassroom, setSelectedClassroom] =
    useState<Omit<Classroom, "students" | "year" | "subjects">>();
  // Fetch the selected Classroom when the selected Classroom ID changes
  useEffect(() => {
    (async () => {
      // Clear the selected Classroom data first
      setSelectedClassroom(undefined);
      if (!selectedID) return false;

      // Fetch the selected Classroom with the selected ID
      const { data, error } = await getClassroomByID(supabase, selectedID);
      if (error) return false;

      // Set the state
      setSelectedClassroom(data);
      return true;
    })();
  }, [selectedID]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Open the Teacher Details Dialog on mobile, otherwise close it
  const { atBreakpoint } = useBreakpoint();
  useEffect(() => {
    if (atBreakpoint !== "base") setDetailsOpen(false);
    else if (selectedID !== userClassroom?.id) setDetailsOpen(true);
  }, [atBreakpoint === "base"]);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup">{t("title")}</PageHeader>

      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={length}>
          <LookupResultsList
            length={length}
            className="[&>ul]:!gap-8 [&>ul]:!pt-0"
          >
            <LayoutGroup>
              {/* The user’s Classroom */}
              {userClassroom && (
                <GradeSection
                  classrooms={[userClassroom]}
                  selected={selectedID}
                  onSelectedChange={(id) => {
                    setSelectedID(id);
                    if (atBreakpoint === "base") setDetailsOpen(true);
                  }}
                  expandedByDefault
                  titleOverride={t("list.yourClass")}
                />
              )}
              {/* Other Classrooms grouped by grade */}
              {Object.entries(grades).map(([grade, classrooms]) => (
                <GradeSection
                  key={grade}
                  grade={grade}
                  classrooms={classrooms}
                  selected={selectedID}
                  onSelectedChange={(id) => {
                    setSelectedID(id);
                    if (atBreakpoint === "base") setDetailsOpen(true);
                  }}
                  expandedByDefault={
                    grade ===
                    (userClassroom ? String(userClassroom.number)[0] : "1")
                  }
                />
              ))}
            </LayoutGroup>
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide
          selectedID={selectedClassroom?.id || selectedID}
          length={length}
        >
          <ClassDetailsCard
            classroom={selectedClassroom}
            teacherID={teacherID}
            isOwnClass={userClassroom?.id === selectedClassroom?.id}
            role={userRole}
          />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <ClassDetailsCard
          classroom={
            selectedID === selectedClassroom?.id ? selectedClassroom : undefined
          }
          teacherID={teacherID}
          isOwnClass={userClassroom?.id === selectedClassroom?.id}
          role={userRole}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  // Get all Classrooms
  const { data: classrooms, error } = await getLookupClassrooms(supabase);
  if (error) return { notFound: true };

  // Group Classrooms by first digit of Classroom number
  const grades = group(classrooms, (classroom) =>
    Math.floor(classroom.number / 100),
  );

  // PS: I hate how “grade” means both the year level and the scoring system!

  // Get the Classroom the user is a part of
  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );
  const userRole = user?.role;
  const userClassroom =
    user && ["student", "teacher"].includes(user.role)
      ? classrooms.find(
          (classroom) =>
            (user?.role === "teacher"
              ? user.class_advisor_at?.id
              : user?.classroom?.id) === classroom.id,
        ) || null
      : null;

  const teacherID = user?.role === "teacher" ? user.id : null;

  const periodNumberAtFetch = getCurrentPeriod();

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      grades,
      userRole,
      userClassroom,
      teacherID,
      periodNumberAtFetch,
    },
  };
};

export default LookupClassesPage;
