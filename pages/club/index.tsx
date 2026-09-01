// Imports
import PageHeader from "@/components/common/PageHeader";
import HomeHeader from "@/components/club/home/HomeHeader";
import JoinedClubsSection from "@/components/club/home/JoinedClubsSection";
import UsefulLinksSection from "@/components/club/home/UsefulLinksSection";
import { Club } from "@/utils/types/club";
import { Student } from "@/utils/types/person";
import {
  Columns,
  ContentLayout,
  transition,
  useAnimationConfig,
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
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import ManagingClubSection from "@/components/club/home/ManagingClubSection";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";

/**
 * The Home page.
 *
 * @param user The current user data.
 * @param isKornor Whether the current user is Kornor.
 * @param joinedClubs An array of Clubs the user has already joined.
 * @param managingClubs An array of Clubs the user manages.
 * @param maxClubQuotas The maximum number of Clubs the user can join.
 */
const ClubPage: NextPage<{
  user: Student;
  isKornor: boolean;
  joinedClubs: Club[];
  managingClubs: Club[];
  maxClubQuotas: number;
}> = ({ user, isKornor, joinedClubs, managingClubs, maxClubQuotas }) => {
  const mysk = useMySKClient();

  const { t } = useTranslation("club");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const [quota, setQuota] = useState<number>(
    maxClubQuotas - joinedClubs.length,
  );

  /* Refetch after close topUp dialog */
  const fetchQuota = async () => {
    const { data: quota } = await mysk.fetch<number>(
      `/v1/students/${user?.id}/clubs/quota`,
    );
    setQuota((quota ?? 0) - joinedClubs.length);
  };

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("header")}</PageHeader>
      <ContentLayout className="!pb-8 [&>*]:px-4 sm:[&>*]:px-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={user ? "logged-in-view" : "public-view"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(duration.medium2, easing.standardDecelerate)}
          >
            <Columns columns={3} className="!gap-y-6">
              <HomeHeader
                quota={quota}
                fetchQuota={fetchQuota}
                user={user}
                isKornor={isKornor}
              />
              <div className="col-span-2 contents flex-col gap-8 sm:flex">
                {managingClubs.length > 0 && (
                  <ManagingClubSection managingClubs={managingClubs} />
                )}
                <JoinedClubsSection clubs={joinedClubs} />
                <UsefulLinksSection />
              </div>
            </Columns>
          </motion.div>
        </AnimatePresence>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const mysk = await createMySKClient(req);

  let joinedClubs: Club[] = [];
  let managingClubs: Club[] = [];
  let user = null;
  let isKornor = false;
  let maxClubQuotas = 0;

  if (mysk.user !== null) {
    const { data } = await getLoggedInPerson(supabase, mysk);
    user = data;
  }

  if (mysk.user?.email == "kornor@sk.ac.th") isKornor = true;

  if (user && user.id != null) {
    const { data: joinedClubsData } = await mysk.fetch<Club[]>("/v1/clubs", {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "detailed",
        filter: {
          data: { member_ids: [user?.id] },
        },
      },
    });

    if (joinedClubsData)
      joinedClubs = joinedClubsData.map((club) => ({
        ...club,
        members: [],
        staffs: [],
      }));

    const { data: managingClubsData } = await mysk.fetch<Club[]>("/v1/clubs", {
      query: {
        fetch_level: "compact",
        filter: { data: { staff_ids: [user?.id] } },
      },
    });

    if (managingClubsData) managingClubs = managingClubsData;

    /* Fetch Club Quotas */
    const { data: maxClubQuotasData } = await mysk.fetch<number>(
      `/v1/students/${user?.id}/clubs/quota`,
    );
    maxClubQuotas = maxClubQuotasData ?? 0;
  }

  return {
    props: {
      user,
      isKornor,
      joinedClubs,
      managingClubs,
      maxClubQuotas,
    },
  };
};

export default ClubPage;
