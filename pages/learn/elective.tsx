import PageHeader from "@/components/common/PageHeader";
import ChooseButton from "@/components/elective/ChooseButton";
import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import ManageTradesCard from "@/components/elective/ManageTradesCard";
import LandingBlobs from "@/components/landing/LandingBlobs";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import { BackendReturn } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject, ElectiveTradeOffer } from "@/utils/types/elective";
import { Student } from "@/utils/types/person";
import {
  Actions,
  ContentLayout,
  DURATION,
  EASING,
  List,
  transition,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

const DIALOG_BREAKPOINTS = ["base", "sm"];

/**
 * A place where Students can choose and trade their Elective Subjects.
 *
 * @param electiveSubjects The Elective Subjects (default) available for choosing.
 * @param enrolledID The ID of the Elective Subject the Student is enrolled in.
 * @param incomingTrades The pending Elective Trade Offers sent to the Student.
 * @param outgoingTrades The pending Elective Trade Offers made by the Student.
 */
const LearnElectivesPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
  enrolledID: number | null;
  incomingTrades: ElectiveTradeOffer[];
  outgoingTrades: ElectiveTradeOffer[];
}> = ({ electiveSubjects, enrolledID, incomingTrades, outgoingTrades }) => {
  const { t } = useTranslation("elective");
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();

  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [selectedElective, setSelectedElective] =
    useState<ElectiveSubject | null>(null);

  // Open Dialog on mobile, otherwise close it
  const { atBreakpoint } = useBreakpoint();
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    if (!DIALOG_BREAKPOINTS.includes(atBreakpoint)) setDetailsOpen(false);
    else if (selectedID) setDetailsOpen(true);
  }, [DIALOG_BREAKPOINTS.includes(atBreakpoint)]);

  async function fetchBySessionCode(sessionCode: number | null) {
    setSelectedElective(null);
    const { data } = await mysk.fetch<ElectiveSubject>(
      `/v1/subjects/electives/${sessionCode}/`,
      {
        query: {
          fetch_level: "detailed",
          descendant_fetch_level: "compact",
        },
      },
    );
    if (data) setSelectedElective(data);
  }
  useEffect(() => {
    const initialSessionCode = enrolledID || electiveSubjects[0]?.session_code;
    if (!initialSessionCode) return;
    setSelectedID(initialSessionCode);
    fetchBySessionCode(initialSessionCode);
  }, []);

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
            className={cn(`min-h-[calc(100dvh-25.5rem)] grow sm:overflow-auto
              sm:rounded-xl sm:bg-surface-bright md:h-0 md:min-h-0`)}
          >
            <List className="sm:!py-2">
              {electiveSubjects.map((electiveSubject) => (
                <ElectiveListItem
                  key={electiveSubject.id}
                  electiveSubject={electiveSubject}
                  selected={selectedID === electiveSubject.session_code}
                  enrolled={enrolledID === electiveSubject.session_code}
                  onClick={() => {
                    va.track("View Elective", {
                      sessionCode: electiveSubject.session_code,
                    });
                    setSelectedID(electiveSubject.session_code);
                    if (DIALOG_BREAKPOINTS.includes(atBreakpoint))
                      setTimeout(
                        () => setDetailsOpen(true),
                        DURATION.short4 * 1000,
                      );
                    if (selectedID !== electiveSubject.session_code)
                      fetchBySessionCode(electiveSubject.session_code);
                  }}
                />
              ))}
            </List>
          </div>

          {/* Choose Button */}
          <div
            className={cn(`pointer-events-none sticky inset-0 bottom-20 top-auto
              z-10 !-mt-6 bg-gradient-to-t from-surface-container p-4 pt-12
              sm:static sm:!mt-0 sm:bg-none sm:p-0 sm:px-0`)}
          >
            <Actions
              className={cn(`!grid !justify-stretch rounded-full
                bg-surface-container sm:!flex sm:!justify-end
                sm:bg-transparent`)}
            >
              <ChooseButton
                sessionCode={selectedID}
                enrolledID={enrolledID}
                className="!pointer-events-auto"
              />
            </Actions>
          </div>
        </section>

        <div
          className={cn(`flex flex-col gap-6 *:rounded-xl *:bg-surface-bright
            md:pb-[3.25rem]`)}
        >
          {/* Details */}
          <motion.main
            key={selectedID}
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={transition(DURATION.medium2, EASING.standardDecelerate)}
            className="hidden grow overflow-hidden md:block"
          >
            <ElectiveDetailsCard
              electiveSubject={selectedElective}
              className="h-full"
            />
          </motion.main>

          {/* Trade */}
          <ManageTradesCard
            incomingTrades={incomingTrades}
            outgoingTrades={outgoingTrades}
            className={cn(`mb-16 min-h-36 !rounded-b-none sm:m-0
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

      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <ElectiveDetailsCard
          electiveSubject={selectedElective}
          enrolledID={enrolledID}
          onChooseSuccess={() => setDetailsOpen(false)}
          className="!mx-0 !bg-surface-container-highest"
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

  // Get the logged in Student.
  const { data: student } = (await getLoggedInPerson(
    supabase,
    mysk,
  )) as BackendReturn<Student>;
  if (!student) return { notFound: true };

  const [
    electiveSubjects,
    enrolledElectiveSubjects,
    incomingTrades,
    outgoingTrades,
  ] = await Promise.all([
    // Get the list of Elective Subjects available for this Student to enroll in.
    (
      await mysk.fetch<ElectiveSubject[]>("/v1/subjects/electives/", {
        query: {
          fetch_level: "default",
          descendant_fetch_level: "compact",
          filter: { data: { as_student_id: student.id } },
          sort: { by: ["session_code"], ascending: true },
        },
      })
    ).data,

    // Get the ID of the Elective Subject the Student is already enrolled in, if
    // any.
    (
      await mysk.fetch<ElectiveSubject[]>("/v1/subjects/electives/", {
        query: {
          fetch_level: "compact",
          filter: { data: { student_ids: [student.id] } },
        },
      })
    ).data,

    // Get active incoming and outgoing trades of the Student.
    (
      await mysk.fetch<ElectiveTradeOffer[]>(
        "/v1/subjects/electives/trade-offers",
        {
          query: {
            fetch_level: "default",
            descendant_fetch_level: "compact",
            filter: {
              data: { receiver_ids: [student.id], status: "pending" },
            },
          },
        },
      )
    ).data,
    (
      await mysk.fetch<ElectiveTradeOffer[]>(
        "/v1/subjects/electives/trade-offers",
        {
          query: {
            fetch_level: "default",
            descendant_fetch_level: "compact",
            filter: {
              data: { sender_ids: [student.id], status: "pending" },
            },
          },
        },
      )
    ).data,
  ]);

  // Use the session code of this Elective Subject as the ID.
  // (A Student can only be enrolled in one Elective Subject at a time.)
  const enrolledID = enrolledElectiveSubjects?.[0]?.session_code || null;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "elective",
        "lookup",
        "schedule",
      ])),
      electiveSubjects,
      enrolledID,
      incomingTrades,
      outgoingTrades,
    },
  };
};

export default LearnElectivesPage;
