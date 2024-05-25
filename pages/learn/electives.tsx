import ChooseButton from "@/components/elective/ChooseButton";
import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveLayout, {
  DIALOG_BREAKPOINTS,
} from "@/components/elective/ElectiveLayout";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import ManageTradesCard from "@/components/elective/ManageTradesCard";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { BackendReturn } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject, ElectiveTradeOffer } from "@/utils/types/elective";
import { Student, UserRole } from "@/utils/types/person";
import {
  Actions,
  DURATION,
  EASING,
  List,
  Text,
  transition,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";

/**
 * A place where Students can choose and trade their Elective Subjects.
 *
 * @param electiveSubjects The Elective Subjects available for choosing.
 * @param enrolledID The ID of the Elective Subject the Student is enrolled in.
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 * @param incomingTrades The pending Elective Trade Offers sent to the Student.
 * @param outgoingTrades The pending Elective Trade Offers made by the Student.
 */
const LearnElectivesPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
  enrolledElective: ElectiveSubject | null;
  inEnrollmentPeriod: boolean;
  incomingTrades: ElectiveTradeOffer[];
  outgoingTrades: ElectiveTradeOffer[];
}> = ({
  electiveSubjects,
  enrolledElective,
  inEnrollmentPeriod,
  incomingTrades,
  outgoingTrades,
}) => {
  const { t } = useTranslation("elective");

  const plausible = usePlausible();
  const mysk = useMySKClient();

  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [selectedElective, setSelectedElective] =
    useState<ElectiveSubject | null>(null);

  // Open Dialog on mobile, otherwise close it.
  const { atBreakpoint } = useBreakpoint();
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    if (!DIALOG_BREAKPOINTS.includes(atBreakpoint)) setDetailsOpen(false);
    else if (selectedID) setDetailsOpen(true);
  }, [DIALOG_BREAKPOINTS.includes(atBreakpoint)]);

  async function fetchByID(id: string) {
    setSelectedElective(null);
    const { data } = await mysk.fetch<ElectiveSubject>(
      `/v1/subjects/electives/${id}`,
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
    if (!enrolledElective) return;
    setSelectedID(enrolledElective.id);
    fetchByID(enrolledElective.id);
  }, [enrolledElective]);

  return (
    <>
      <ElectiveLayout role={UserRole.student}>
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
                  role={UserRole.student}
                  electiveSubject={electiveSubject}
                  selected={selectedID === electiveSubject.id}
                  enrolled={enrolledElective?.id === electiveSubject.id}
                  onClick={() => {
                    plausible("View Elective", {
                      props: {
                        subject: getLocaleString(electiveSubject.name, "en-US"),
                      },
                    });
                    setSelectedID(electiveSubject.id);
                    if (DIALOG_BREAKPOINTS.includes(atBreakpoint))
                      setTimeout(
                        () => setDetailsOpen(true),
                        DURATION.short4 * 1000,
                      );
                    if (selectedID !== electiveSubject.id)
                      fetchByID(electiveSubject.id);
                  }}
                />
              ))}
            </List>
          </div>

          {/* Choose Button */}
          <div
            className={cn(`pointer-events-none sticky inset-0 bottom-20 top-auto
              z-[90] !-mt-6 bg-gradient-to-t from-surface-container p-4 pt-12
              sm:pointer-events-auto sm:static sm:!mt-0 sm:bg-none sm:p-0
              sm:px-0`)}
          >
            <Actions
              className={cn(`!grid !justify-stretch rounded-full
                bg-surface-container sm:!flex sm:!justify-end
                sm:bg-transparent`)}
            >
              <ChooseButton
                electiveSubject={
                  electiveSubjects.find((subject) => subject.id === selectedID)!
                }
                enrolledElective={enrolledElective}
                disabled={
                  !inEnrollmentPeriod || enrolledElective?.id === selectedID
                }
                className="!pointer-events-auto"
              />
            </Actions>
          </div>
        </section>

        <div className="flex flex-col gap-6 md:pb-[3.25rem]">
          {/* Details */}
          <motion.main
            key={selectedID || "empty"}
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={transition(DURATION.medium2, EASING.standardDecelerate)}
            className="relative hidden grow *:absolute *:inset-0 md:block"
          >
            {selectedID ? (
              // Content state
              <ElectiveDetailsCard electiveSubject={selectedElective} />
            ) : (
              // Empty state
              <div className="grid place-content-center">
                <Text
                  type="body-medium"
                  element="p"
                  className="max-w-52 text-center text-on-surface-variant"
                >
                  {t("detail.empty")}
                </Text>
              </div>
            )}
          </motion.main>

          {/* Trade */}
          <ManageTradesCard
            incomingTrades={incomingTrades}
            outgoingTrades={outgoingTrades}
            inEnrollmentPeriod={inEnrollmentPeriod}
            className={cn(`mb-16 min-h-36 !rounded-b-none sm:m-0
              sm:!rounded-b-xl`)}
          />
        </div>
      </ElectiveLayout>

      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <ElectiveDetailsCard
          electiveSubject={selectedElective}
          enrolledElective={enrolledElective || null}
          inEnrollmentPeriod={inEnrollmentPeriod}
          onChooseSuccess={() => setDetailsOpen(false)}
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

  // Get the logged in Student.
  const { data: student } = (await getLoggedInPerson(
    supabase,
    mysk,
  )) as BackendReturn<Student>;
  if (!student) return { notFound: true };

  const [
    { data: electiveSubjects },
    { data: enrolledElectiveSubjects },
    { data: inEnrollmentPeriod },
  ] = await Promise.all([
    // Get the list of Elective Subjects available for this Student to enroll in.
    await mysk.fetch<ElectiveSubject[]>("/v1/subjects/electives", {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "compact",
        filter: { data: { applicable_classroom_ids: [student.classroom?.id] } },
        sort: { by: ["session_code"], ascending: true },
      },
    }),

    // Get the ID of the Elective Subject the Student is already enrolled in, if
    // any.
    await mysk.fetch<ElectiveSubject[]>("/v1/subjects/electives", {
      query: {
        fetch_level: "compact",
        filter: {
          data: {
            student_ids: [student.id],
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
      },
    }),

    // Check if the time now is in an Enrollment Period.
    await mysk.fetch<boolean>("/v1/subjects/electives/in-enrollment-period"),
  ]);

  // If there are no Elective Subjects available, return a 404.
  if (!electiveSubjects?.length) return { notFound: true };

  const trades = {
    incomingTrades: [] as ElectiveTradeOffer[],
    outgoingTrades: [] as ElectiveTradeOffer[],
  };

  // If we are in an Enrollment Period, get the pending Elective Trade Offers
  // sent to and made by the Student.
  if (inEnrollmentPeriod) {
    const [{ data: incomingTrades }, { data: outgoingTrades }] =
      await Promise.all([
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
        ),
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
        ),
      ]);
    if (incomingTrades) trades.incomingTrades = incomingTrades;
    if (outgoingTrades) trades.outgoingTrades = outgoingTrades;
  }

  // A Student can only be enrolled in one Elective Subject at a time.
  const enrolledElective = enrolledElectiveSubjects?.[0] || null;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "elective",
      ])),
      electiveSubjects,
      enrolledElective,
      inEnrollmentPeriod,
      ...trades,
    },
  };
};

export default LearnElectivesPage;
