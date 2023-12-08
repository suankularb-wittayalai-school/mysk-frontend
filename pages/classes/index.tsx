// Imports
import ClassDetailsCard from "@/components/classes/ClassDetailsCard";
import GradeSection from "@/components/classes/GradeSection";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import getClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import { Classroom } from "@/utils/types/classroom";
import { LangCode } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
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
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { group } from "radash";
import { useEffect, useMemo, useState } from "react";

/**
 * The Classes page shows a list of all Classrooms in the current academic year.
 * The user can select a Classroom to view its details.
 *
 * The user’s Classroom is selected by default and has the most content
 * revealed. Other Classrooms have minimal information to prevent privacy
 * issues.
 *
 * @param grades The Classrooms grouped by grade.
 * @param user The currently logged in user. Used for Role and Permissions.
 * @param userClassroom The Classroom the user is a part of.
 */
const ClassesPage: NextPage<{
  grades: { [grade: string]: Pick<Classroom, "id" | "number" | "main_room">[] };
  user: User;
  userClassroom?: Pick<Classroom, "id" | "number" | "main_room">;
  teacherID?: string;
}> = ({ grades, user, userClassroom, teacherID }) => {
  const { t } = useTranslation("classes");
  const { t: tx } = useTranslation("common");

  /**
   * The total number of Classrooms.
   */
  const length = useMemo(() => Object.values(grades).flat().length, [grades]);

  const [selectedID, setSelectedID] = useState<string | undefined>(
    userClassroom?.id || grades[1][0]?.id,
  );

  const supabase = useSupabaseClient();

  /**
   * Fetch data for the selected Classroom.
   */
  async function fetchSelectedClass() {
    if (!selectedID) return;
    const { data, error } = await getClassroomByID(supabase, selectedID, {
      includeStudents: teacherID !== null || selectedID === userClassroom?.id,
    });
    if (!error) setSelectedClassroom(data);
  }

  const [selectedClassroom, setSelectedClassroom] =
    useState<Omit<Classroom, "year" | "subjects">>();
  // Fetch the selected Classroom when the selected Classroom ID changes
  useEffect(() => {
    setSelectedClassroom(undefined);
    fetchSelectedClass();
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
      <PageHeader>{t("title")}</PageHeader>

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
            role={user.role}
            refreshData={fetchSelectedClass}
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
          role={user.role}
          refreshData={fetchSelectedClass}
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
  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  // Get all Classrooms
  const { data: classrooms, error } = await getClassrooms(supabase);
  if (error) return { notFound: true };

  // Group Classrooms by first digit of Classroom number
  const grades = group(classrooms, (classroom) =>
    Math.floor(classroom.number / 100),
  );

  // PS: I hate how “grade” means both the year level and the scoring system!

  // Get the Classroom the user is a part of
  const { data: person } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );
  const userClassroom =
    person && ["student", "teacher"].includes(person.role)
      ? classrooms.find(
          (classroom) =>
            (person?.role === "teacher"
              ? person.class_advisor_at?.id
              : person?.classroom?.id) === classroom.id,
        ) || null
      : null;

  const teacherID = person?.role === "teacher" ? person.id : null;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        ...(person?.role === "teacher" ? ["account"] : []),
        "classes",
      ])),
      grades,
      user,
      userClassroom,
      teacherID,
    },
  };
};

export default ClassesPage;
