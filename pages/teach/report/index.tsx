import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import AddReportButton from "@/components/report/AddReportButton";
import ReportDetailsCard from "@/components/report/ReportDetailsCard";
import { ReportListItem } from "@/components/report/ReportListItem";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import cn from "@/utils/helpers/cn";
import { BackendReturn } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { Report } from "@/utils/types/report";
import {
  DURATION,
  EASING,
  SplitLayout,
  Text,
  transition
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useState } from "react";
import Balancer from "react-wrap-balancer";

const ReportPage: CustomPage<{
  teacher: Teacher;
  reports: Report[];
}> = ({ teacher, reports }) => {
  const [selectedID, setSelectedID] = useState<string>("1");

  const { t } = useTranslation("report");
  const { t: tx } = useTranslation("common");
  function handleAddReport() {
    setSelectedID("2");
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/teach">{"รายงานการสอน"}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={reports.length}>
          <AddReportButton onAddReport={handleAddReport} />
          <LookupResultsList length={reports.length}>
              {reports?.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  selected={selectedID === report.id}
                  onClick={() => {
                    setSelectedID(report.id);
                  }}
                />
              )) || (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...transition(DURATION.medium2, EASING.standardDecelerate),
                    delay: DURATION.medium2,
                  }}
                  className={cn(
                    `skc-card skc-card--outlined mt-4 flex grow flex-col items-center justify-center gap-1 p-4 sm:mb-6`,
                  )}
                >
                  <Text
                    type="body-medium"
                    element="p"
                    className="text-center text-on-surface-variant"
                  >
                    <Balancer>{t("empty")}</Balancer>
                  </Text>
                </motion.div>
              )}
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide length={reports.length} selectedID={selectedID}>
          <ReportDetailsCard
            teacher={teacher}
            report={reports.filter((report) => report.id == selectedID)}
          />
        </LookupDetailsSide>
      </SplitLayout>
      <div className="md:!hidden">
        <LookupDetailsDialog
          open={selectedID !== "1"}
          onClose={() => setSelectedID("1")}
        >
          <ReportDetailsCard
            teacher={teacher}
            report={reports.filter((report) => report.id == selectedID)}
          />
        </LookupDetailsDialog>
      </div>
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

  const { data: teacher } = (await getLoggedInPerson(supabase, mysk, {
    detailed: true,
  })) as BackendReturn<Teacher>;
  if (!teacher) return { notFound: true };

  const { data: reports } = await mysk.fetch<Report[]>(
    "/v1/subjects/attendance",
    {
      query: {
        fetch_level: "compact",
        descendant_fetch_level: "default",
        filter: {
          data: {
            as_teacher_id: teacher.id,
          },
        },
      },
    },
  );
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "report",
      ])),
      teacher,
      reports,
    },
  };
};

export default ReportPage;
