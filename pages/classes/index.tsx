import ClassDetailsCard from "@/components/classes/ClassDetailsCard";
import GradeSection from "@/components/classes/GradeSection";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import getClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SplitLayout, useBreakpoint } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LayoutGroup } from "framer-motion";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { first, group } from "radash";
import { useEffect, useState } from "react";

/**
 * The Classes page shows a list of all Classrooms in the current academic year.
 * The user can select a Classroom to view its details.
 *
 * The user’s Classroom is selected by default and has the most content
 * revealed. Other Classrooms have minimal information to prevent privacy
 * issues.
 *
 * @param grades The Classrooms grouped by grade.
 */
const ClassesPage: NextPage<{
  classrooms: Pick<Classroom, "id" | "number" | "main_room">[];
}> = ({ classrooms }) => {
  const { t } = useTranslation("classes");
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const userClassroom =
    (mysk.person &&
      classrooms.find(
        (classroom) => classroomOfPerson(mysk.person!)?.id === classroom.id,
      )) ||
    null;

  const [selectedID, setSelectedID] = useState<string | undefined>(
    userClassroom?.id || first(classrooms)?.id,
  );
  useEffect(() => {
    if (userClassroom) setSelectedID(userClassroom.id);
  }, [userClassroom]);

  /**
   * Fetch data for the selected Classroom.
   */
  async function fetchSelectedClass() {
    if (!selectedID) return;
    const { data, error } = await getClassroomByID(supabase, selectedID, {
      includeStudents:
        (mysk.user &&
          (mysk.user.is_admin || mysk.user.role !== UserRole.student)) ||
        selectedID === userClassroom?.id,
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
        <LookupListSide length={classrooms.length}>
          <LookupResultsList
            length={classrooms.length}
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
              {Object.entries(
                group(classrooms, (classroom) =>
                  Math.floor(classroom.number / 100),
                ) as Record<string, typeof classrooms>,
              ).map(([grade, classrooms]) => (
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
          length={classrooms.length}
        >
          <ClassDetailsCard
            classroom={selectedClassroom}
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
          refreshData={fetchSelectedClass}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: classrooms } = await getClassrooms(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "attendance",
        "classes",
        "lookup",
        "schedule",
      ])),
      classrooms,
    },
    revalidate: 300,
  };
};

export default ClassesPage;
