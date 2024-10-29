import ClassDetailsCard from "@/components/classes/ClassDetailsCard";
import GradeSection from "@/components/classes/GradeSection";
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import getLookupClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import useListDetail from "@/utils/helpers/search/useListDetail";
import useBreakpoint, { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SplitLayout } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LayoutGroup } from "framer-motion";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { first, group } from "radash";
import { useEffect } from "react";

/**
 * The Classes page shows a list of all Classrooms in the current academic year.
 * The user can select a Classroom to view its details.
 *
 * The user’s Classroom is selected by default and has the most content
 * revealed. Other Classrooms have minimal information to prevent privacy
 * issues.
 *
 * @param classrooms The list of Classrooms to display.
 */
const ClassesPage: NextPage<{
  classrooms: Pick<Classroom, "id" | "number" | "main_room">[];
}> = ({ classrooms }) => {
  const { t } = useTranslation("classes/list");
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const userClassroom =
    (mysk.person &&
      classrooms.find(
        (classroom) => classroomOfPerson(mysk.person!)?.id === classroom.id,
      )) ||
    null;

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    refreshDetail,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<Pick<Classroom, "id" | "number" | "main_room">, Classroom>(
    classrooms,
    (id) =>
      getClassroomByID(supabase, id, {
        includeStudents:
          (mysk.user &&
            (mysk.user.is_admin || mysk.user.role !== UserRole.student)) ||
          id === userClassroom?.id,
      }),
    { dialogBreakpoints: [Breakpoint.base] },
  );

  // Default the selected Classroom to the user’s Classroom or the first
  // Classroom on the list. Ignore if on mobile.
  const { breakpoint, belowBreakpoint } = useBreakpoint();
  useEffect(() => {
    if (belowBreakpoint(Breakpoint.sm) !== false) return;
    else if (userClassroom) onSelectedChange(userClassroom.id);
    else if (classrooms.length) onSelectedChange(first(classrooms)!.id);
  }, [breakpoint, userClassroom]);

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
                  selectedID={selectedID}
                  onSelectedChange={onSelectedChange}
                  expandedByDefault
                  titleOverride={t("yourClass")}
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
                  selectedID={selectedID}
                  onSelectedChange={onSelectedChange}
                  expandedByDefault={
                    grade ===
                    (userClassroom ? String(userClassroom.number)[0] : "1")
                  }
                />
              ))}
            </LayoutGroup>
          </LookupResultsList>
        </LookupListSide>

        {/* Details */}
        <LookupDetailsSide
          selectedID={selectedDetail?.id || selectedID}
          length={classrooms.length}
        >
          <ClassDetailsCard
            classroom={selectedDetail}
            refreshData={refreshDetail}
          />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <ClassDetailsCard
          classroom={selectedDetail}
          refreshData={refreshDetail}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: classrooms } = await getLookupClassrooms(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      classrooms,
    },
    revalidate: 300,
  };
};

export default ClassesPage;
