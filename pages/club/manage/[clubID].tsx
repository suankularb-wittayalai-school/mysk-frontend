// Imports
import PageHeader from "@/components/common/PageHeader";
import MembersView from "@/components/club/manage/club/MembersView";
import OverviewView from "@/components/club/manage/club/OverviewView";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import { Database } from "@/utils/types/supabase";
import { Club, ClubJoinRequest, ClubStatistics } from "@/utils/types/club";
import { Student, Teacher } from "@/utils/types/person";
import {
  ContentLayout,
  MaterialIcon,
  Tab,
  TabsContainer,
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useState } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";

/**
 * Allows Club Managers to view and configure information about their club—
 * including identity, Contacts, and statistics—and approve new members.
 *
 * @param club A Club instance.
 * @param statistics Statistics to show in the Cool Statistics Section.
 * @param requests An array of Club Join Requests, shown in the Members tab.
 *
 * @returns A Page.
 */
const ClubManagePage: NextPage<{
  club: Club;
  statistics: ClubStatistics;
  requests: ClubJoinRequest[];
}> = ({ club, statistics, requests }) => {
  const locale = useLocale();
  const { t } = useTranslation("club/manage");
  const { t: tx } = useTranslation("common");

  const [allowTabChange, setAllowTabChange] = useState(true);
  const [view, setView] = useState<"overview" | "members">("overview");

  const { duration, easing } = useAnimationConfig();
  const { atBreakpoint } = useBreakpoint();

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("club", { name: getLocaleString(club.name, locale) }),
          })}
        </title>
      </Head>

      <PageHeader parentURL="/club" className="mx-4 sm:mx-0">
        {t("club", { name: getLocaleString(club.name, locale) })}
      </PageHeader>

      <ContentLayout>
        {/* Tabs */}
        <div className="-mt-4">
          <TabsContainer appearance="primary" alt="View">
            <Tab
              icon={<MaterialIcon icon="info" />}
              label={t("tab.overview")}
              selected={view === "overview"}
              onClick={() => {
                if (allowTabChange && view !== "overview") {
                  setView("overview");
                  setAllowTabChange(false);
                }
              }}
            />
            <Tab
              icon={<MaterialIcon icon="groups" />}
              label={t("tab.members")}
              selected={view === "members"}
              onClick={() => {
                if (allowTabChange && view !== "members") {
                  setView("members");
                  setAllowTabChange(false);
                }
              }}
            />
          </TabsContainer>
        </div>

        {/* Views */}
        <AnimatePresence
          mode={atBreakpoint === "base" ? "wait" : "popLayout"}
          initial={false}
          onExitComplete={() => setAllowTabChange(true)}
        >
          {view === "overview" ? (
            // Overview view
            <motion.div
              key="overview"
              initial={{
                opacity: 0,
                ...(atBreakpoint === "base" ? { y: 40 } : { x: -360 }),
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={
                atBreakpoint !== "base" ? { opacity: 0, x: -360 } : undefined
              }
              transition={transition(
                duration[atBreakpoint === "base" ? "medium2" : "long2"],
                easing.standard,
              )}
              className="[&>*]:mx-4 sm:[&>*]:mx-0"
            >
              <OverviewView club={club} statistics={statistics} />
            </motion.div>
          ) : (
            // Members view
            <motion.div
              key="members"
              initial={{
                opacity: 0,
                ...(atBreakpoint === "base" ? { y: 40 } : { x: 360 }),
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={
                atBreakpoint !== "base" ? { opacity: 0, x: 360 } : undefined
              }
              transition={transition(
                duration[atBreakpoint === "base" ? "medium2" : "long2"],
                easing.standard,
              )}
              className="flex flex-col gap-6 [&>*]:mx-4 sm:[&>*]:mx-0"
            >
              <MembersView club={club} requests={requests} />
            </motion.div>
          )}
        </AnimatePresence>
        <style jsx global>{`
          body {
            overflow-y: scroll;
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const supabase = createPagesServerClient<Database>({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const mysk = await createMySKClient(req);

  let user: Student | Teacher | null = null;

  // Fetch Club
  if (!params?.clubID) return { notFound: true };
  const { data: club, error } = await mysk.fetch<Club>(
    `/v1/clubs/${params.clubID}`,
    { query: { fetch_level: "detailed", descendant_fetch_level: "default" } },
  );
  if (error?.code === 404) return { notFound: true };

  if (mysk.user !== null) {
    const { data } = await getLoggedInPerson(supabase, mysk);
    user = data;
  }
  // The user must either be a staff or an admin to view the page
  if (!(club!.staffs.find((staff) => user!.id === staff.id) || user?.is_admin))
    return { notFound: true };

  // This block of code was supposed to group Members by their Class to display
  // on the Cool Statistics Section. Unfortunately, the API does not return a
  // Member’s Class even on the highest fetch level.

  // const groupedMembers = group(
  //   club.members,
  //   (member) => member.class?.id || "unknown"
  // );
  const statistics: ClubStatistics = {
    count: club!.member_count,
    byClass: [],
  };

  // Fetch Requests
  /* invalid_permission with descendant_fetch_level: "default", can only get student id*/
  const { data: requests } = await mysk.fetch<ClubJoinRequest[]>(
    "/v1/clubs/requests",
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "id_only",
        filter: {
          data: {
            club_ids: [params?.clubID],
            membership_status: "pending",
            year: getCurrentAcademicYear(),
          },
        },
      },
    },
  );

  const studentIDs = requests?.map((requests) => requests.student.id) ?? []
  const { data: students } = await getStudentsByIDs(supabase, mysk, studentIDs);

  const studentMap = new Map(
    students?.map((student) => [student.id, student]) ?? [],
  );

  const requestsWithStudents =
    requests?.map((request) => {
      const detailedStudent = studentMap.get(request.student.id);

      return {
        ...request,
        student: {
          id: detailedStudent?.id,
          first_name: detailedStudent?.first_name,
          last_name: detailedStudent?.last_name,
        },
      };
    }) ?? [];

  return {
    props: {
      club,
      statistics,
      requests: requestsWithStudents,
    },
  };
};

export default ClubManagePage;
