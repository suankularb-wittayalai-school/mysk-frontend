import PageHeader from "@/components/common/PageHeader";
import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import TradesCard from "@/components/elective/TradesCard";
import LandingBlobs from "@/components/landing/LandingBlobs";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Student } from "@/utils/types/person";
import {
  Actions,
  Button,
  ContentLayout,
  DURATION,
  EASING,
  List,
  MaterialIcon,
  transition,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

/**
 * A place where Students can choose and trade their Elective Subjects.
 *
 * @param electiveSubjects The Elective Subjects (default) available for choosing.
 * @param selectedID The ID of the Elective Subject the Student is enrolled in.
 */
const LearnElectivesPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
  enrolledID: number | null;
}> = ({ electiveSubjects, enrolledID }) => {
  const { t } = useTranslation("elective");
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();
  const refreshProps = useRefreshProps();

  // Selected IDs, for Radio and details
  const [radioSelectedID, setRadioSelectedID] = useState<number | null>(
    enrolledID,
  );
  const [detailSelectedID, setDetailSelectedID] = useState<number | null>(
    electiveSubjects[0]?.session_code,
  );

  // Details of the selected Elective Subject
  const [detailSelectedElective, setDetailSelectedElective] =
    useState<ElectiveSubject | null>(null);

  async function fetchSelectedElectiveDetails(
    electiveSubject: ElectiveSubject,
  ) {
    setDetailSelectedElective(null);
    const { data } = await mysk.fetch<ElectiveSubject>(
      `/v1/subjects/electives/${electiveSubject.session_code}/`,
      {
        query: {
          fetch_level: "detailed",
          descendant_fetch_level: "compact",
        },
      },
    );
    if (data) setDetailSelectedElective(data);
  }
  useEffect(() => {
    fetchSelectedElectiveDetails(electiveSubjects[0]);
  }, []);

  const [loading, toggleLoading] = useToggle();

  /**
   * Choose or change to the selected Elective Subject, depending on context.
   */
  async function handleChoose() {
    if (radioSelectedID === enrolledID) return;
    withLoading(
      async () => {
        const { error } = await mysk.fetch(
          `/v1/subjects/electives/${radioSelectedID}/enroll/`,
          {
            // POST for choosing, PUT for changing.
            method: enrolledID ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fetch_level: "id_only" }),
          },
        );
        if (error) logError("handleChoose", error);
        await refreshProps();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: t("title", { context: "student" }) })}
        </title>
      </Head>

      {/* Background */}
      <div
        className={cn(`fixed inset-0 bottom-auto -z-10 hidden h-screen
          overflow-hidden sm:block`)}
      >
        <LandingBlobs className="inset-0" />
      </div>

      {/* Content */}
      <PageHeader parentURL="/learn">
        {t("title", { context: "student" })}
      </PageHeader>
      <ContentLayout
        className={cn(`grow *:h-full *:!gap-6 sm:*:!grid
          md:*:grid-cols-[5fr,7fr]`)}
      >
        <section className="flex-col gap-3 space-y-3 sm:flex">
          {/* List */}
          <div
            className={cn(`grow sm:overflow-auto sm:rounded-xl
              sm:bg-surface-bright md:h-0`)}
          >
            <List className="sm:!py-2">
              {electiveSubjects.map((electiveSubject) => (
                <ElectiveListItem
                  key={electiveSubject.id}
                  electiveSubject={electiveSubject}
                  radioSelected={
                    radioSelectedID === electiveSubject.session_code
                  }
                  detailSelected={
                    detailSelectedID === electiveSubject.session_code
                  }
                  enrolled={enrolledID === electiveSubject.session_code}
                  onRadioToggle={(value) => {
                    if (value) setRadioSelectedID(electiveSubject.session_code);
                  }}
                  onClick={() => {
                    setDetailSelectedID(electiveSubject.session_code);
                    fetchSelectedElectiveDetails(electiveSubject);
                  }}
                />
              ))}
            </List>
          </div>

          {/* Choose Button */}
          <Actions
            className={cn(`pointer-events-none sticky inset-0 bottom-20 top-auto
              z-10 !-mt-6 !block bg-gradient-to-t from-surface-container p-4
              pt-12 sm:static sm:!mt-0 sm:!flex sm:bg-none sm:p-0 sm:px-0`)}
          >
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="done" />}
              onClick={handleChoose}
              disabled={radioSelectedID === enrolledID || loading}
              className="!pointer-events-auto"
            >
              {t("list.action.choose", {
                context: !enrolledID
                  ? "initial"
                  : radioSelectedID !== enrolledID
                    ? "change"
                    : "chosen",
              })}
            </Button>
          </Actions>
        </section>

        <div
          className={cn(`flex flex-col gap-6 *:rounded-xl *:bg-surface-bright
            md:pb-[3.25rem]`)}
        >
          {/* Details */}
          <motion.main
            key={detailSelectedID}
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={transition(DURATION.medium2, EASING.standardDecelerate)}
            className="hidden grow md:block"
          >
            <ElectiveDetailsCard
              electiveSubject={detailSelectedElective}
              className="h-full"
            />
          </motion.main>

          {/* Trade */}
          <TradesCard
            className={cn(`mb-16 h-36 !rounded-b-none sm:m-0
              sm:!rounded-b-xl`)}
          />
        </div>

        <style jsx global>{`
          body {
            background-color: var(--surface-container);
          }

          .skc-root-layout {
            display: flex;
            flex-direction: column;
            height: 100dvh;
          }

          @media only screen and (min-width: 600px) {
            .skc-nav-bar::before {
              background-color: transparent !important;
            }

            .skc-page-header__blobs {
              display: none !important;
            }
          }
        `}</style>
      </ContentLayout>
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

  // Get the logged in Student.
  const { data: student } = (await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  )) as { data: Student };

  // Get the list of Elective Subjects available for this Student to enroll in.
  const { data: electiveSubjects } = await mysk.fetch<ElectiveSubject[]>(
    "/v1/subjects/electives/",
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "compact",
        filter: { data: { as_student_id: student.id } },
        sort: { by: ["session_code"], ascending: true },
      },
    },
  );

  // Get the ID of the Elective Subject the Student is already enrolled in, if
  // any.
  const { data: enrolledElectiveSubjects } = await mysk.fetch<
    ElectiveSubject[]
  >("/v1/subjects/electives/", {
    query: {
      fetch_level: "compact",
      filter: { data: { student_ids: [student.id] } },
    },
  });

  // Use the session code of this Elective Subject as the ID.
  // (A Student can only be enrolled in one Elective Subject at a time.)
  const enrolledID = enrolledElectiveSubjects?.[0]?.session_code || null;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "elective",
        "lookup",
      ])),
      electiveSubjects,
      enrolledID,
    },
  };
};

export default LearnElectivesPage;
