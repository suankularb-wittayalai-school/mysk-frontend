// Imports
import PageHeader from "@/components/common/PageHeader";
import HomeHeader from "@/components/club/home/HomeHeader";
import JoinedClubsSection from "@/components/club/home/JoinedClubsSection";
import UsefulLinksSection from "@/components/club/home/UsefulLinksSection";
import { Club } from "@/utils/types/club";
import { Student, UserRole } from "@/utils/types/person";
import { LangCode } from "@/utils/types/common";
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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import ManagingClubSection from "@/components/club/home/ManagingClubSection";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";

/**
 * The Home page.
 *
 * @param user The current user data.
 * @param redirectToClub The Club the log in Button redirects to.
 * @param joinedClubs An array of Clubs the user has already joined.
 * @param managingClubs An array of Clubs the user manage.
 *
 * @returns A Page.
 */
const ClubPage: NextPage<{
  user: Student;
  isKornor: boolean;
  redirect?: string;
  redirectToClub?: Club;
  joinedClubs: Club[];
  managingClubs: Club[];
  maxClubQuotas: number;
}> = ({
  user,
  isKornor,
  redirectToClub,
  joinedClubs,
  managingClubs,
  maxClubQuotas,
}) => {
  const mysk = useMySKClient();

  const { t } = useTranslation("club");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();
  const router = useRouter();

  const [quota, setQuota] = useState<number>(
    (maxClubQuotas ?? 0) - joinedClubs.length,
  );

  useEffect(() => {
    if (redirectToClub) router.replace(`/join/club/${redirectToClub.id}`);
  }, [redirectToClub]);

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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const mysk = await createMySKClient(req);

  let joinedClubs: Club[] = [];
  let managingClubs: Club[] = [];
  let redirectToClub: Club | null = null;
  let user = null;
  let isKornor = false;

  if (mysk.user !== null) {
    const { data } = await getLoggedInPerson(supabase, mysk);
    user = data;
  }

  if (mysk.user?.role === UserRole.organization) isKornor = true;

  const { data: joinedClubsData } = await mysk.fetch<Club[]>("/v1/clubs", {
    query: {
      fetch_level: "default",
      descendant_fetch_level: "compact",
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

  if (query.club)
    redirectToClub = (
      await mysk.fetch<Club>(`/v1/clubs/${query.club}`, {
        query: { fetch_level: "compact" },
      })
    ).data;

  /* Fetch Club Quotas */
  const { data: maxClubQuotas } = await mysk.fetch<number>(
    `/v1/students/${user?.id}/clubs/quota`,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "index",
      ])),
      user,
      isKornor,
      redirect: query.redirect || null,
      redirectToClub,
      joinedClubs,
      managingClubs,
      maxClubQuotas,
    },
  };
};

export default ClubPage;
