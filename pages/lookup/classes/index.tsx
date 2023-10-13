// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import GradeSection from "@/components/lookup/classes/GradeSection";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getLookupClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import useNow from "@/utils/helpers/useNow";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Classroom } from "@/utils/types/classroom";
import { LangCode } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { SplitLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
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
  userClassroom?: LookupClassItem;
  periodNumberAtFetch: number;
}> = ({ grades, userClassroom, periodNumberAtFetch }) => {
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const refreshProps = useRefreshProps();

  const now = useNow();

  const currentPeriodNumber = getCurrentPeriod();
  useEffect(() => {
    if (currentPeriodNumber !== periodNumberAtFetch) refreshProps();
  }, [currentPeriodNumber]);

  const length = useMemo(() => Object.values(grades).flat().length, [grades]);

  const [selected, setSelected] = useState<string | undefined>(
    userClassroom?.id || undefined,
  );

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("classes.title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup">{t("classes.title")}</PageHeader>

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
                  selected={selected}
                  onSelectedChange={setSelected}
                  now={now}
                  expandedByDefault
                  titleOverride="Your class"
                />
              )}
              {/* Other Classrooms grouped by grade */}
              {Object.entries(grades).map(([grade, classrooms]) => (
                <GradeSection
                  key={grade}
                  grade={grade}
                  classrooms={classrooms}
                  selected={selected}
                  onSelectedChange={setSelected}
                  now={now}
                  expandedByDefault={grade === "1"}
                />
              ))}
            </LayoutGroup>
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide length={length}>{}</LookupDetailsSide>
      </SplitLayout>
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

  // PS: I hate how “grade” means both the year level and the scoring system.

  // Get the Classroom the user is a part of
  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );
  const userClassroom =
    user && ["student", "teacher"].includes(user.role)
      ? classrooms.find(
          (classroom) =>
            (user?.role === "teacher"
              ? user.class_advisor_at?.id
              : user?.classroom?.id) === classroom.id,
        )
      : null;

  const periodNumberAtFetch = getCurrentPeriod();

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      grades,
      userClassroom,
      periodNumberAtFetch,
    },
  };
};

export default LookupClassesPage;
