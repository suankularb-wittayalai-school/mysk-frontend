import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveLayout, {
  DIALOG_BREAKPOINTS,
} from "@/components/elective/ElectiveLayout";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import ElectiveStudentListCard from "@/components/elective/ElectiveStudentListCard";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import useListDetail from "@/utils/helpers/search/useListDetail";
import { BackendReturn } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Teacher, UserRole } from "@/utils/types/person";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * A place where the Teacher can view their Elective Subjects and the respective
 * enrolled Students.
 *
 * @param electiveSubjects The Elective Subjects the Teacher is in charge of.
 */
const TeachElectivesPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
}> = ({ electiveSubjects }) => {
  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<ElectiveSubject>(electiveSubjects, undefined, {
    firstByDefault: true,
    dialogBreakpoints: DIALOG_BREAKPOINTS,
  });

  return (
    <>
      <ElectiveLayout role={UserRole.teacher}>
        {/* List */}
        <section
          className={cn(`md:fade-out-to-t overflow-auto md:-mb-9 md:-mt-8
            md:pt-8`)}
        >
          <ul className="space-y-1.5 px-4 sm:px-0 md:h-0">
            {electiveSubjects.map((electiveSubject) => (
              <ElectiveListItem
                key={electiveSubject.session_code}
                role={UserRole.teacher}
                electiveSubject={electiveSubject}
                selected={selectedID === electiveSubject.id}
                onClick={() => onSelectedChange(electiveSubject.id)}
              />
            ))}
            {/* There’s probably a better solution. If there is, I don’t know
                what it is. */}
            <div aria-hidden className="h-28 sm:h-9" />
          </ul>
        </section>

        {/* Details */}
        <motion.section
          key={selectedID || "empty"}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={transition(DURATION.medium2, EASING.standardDecelerate)}
          className="hidden flex-col gap-6 md:flex"
        >
          <main className="relative grow *:absolute *:inset-0">
            {selectedDetail && (
              <ElectiveDetailsCard electiveSubject={selectedDetail} />
            )}
          </main>

          {/* Enrolled Students */}
          {selectedDetail && (
            <ElectiveStudentListCard
              electiveSubject={selectedDetail}
              className="h-[18rem]"
            />
          )}
        </motion.section>
      </ElectiveLayout>

      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <ElectiveDetailsCard
          electiveSubject={selectedDetail}
          className={cn(`!mx-0 h-full !bg-surface-container-highest
            *:!rounded-b-none`)}
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
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  // Get the logged in Teacher.
  const { data: teacher } = (await getLoggedInPerson(
    supabase,
    mysk,
  )) as BackendReturn<Teacher>;
  if (!teacher) return { notFound: true };

  const { data: electiveSubjects } = await mysk.fetch<ElectiveSubject[]>(
    "/v1/subjects/electives",
    {
      query: {
        fetch_level: "detailed",
        descendant_fetch_level: "default",
        filter: {
          data: {
            teacher_ids: [teacher.id],
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
        sort: { by: ["session_code"], ascending: true },
      },
    },
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
        "elective",
      ])),
      electiveSubjects,
    },
  };
};

export default TeachElectivesPage;
