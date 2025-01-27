import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import PageHeader from "@/components/common/PageHeader";
import {
  Button,
  DURATION,
  EASING,
  List,
  MaterialIcon,
  SplitLayout,
  Text,
  transition,
} from "@suankularb-components/react";
import { ReportListItem } from "@/components/report/ReportListItem";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { BackendReturn } from "@/utils/types/backend";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Report } from "@/utils/types/report";
import AddReportButton from "@/components/report/AddReportButton";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import cn from "@/utils/helpers/cn";
import { useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import ReportDetailsCard from "@/components/report/ReportDetailsCard";

const ReportPage: CustomPage<{
  teacher: Teacher;
  reports: Report[];
}> = ({ teacher, reports }) => {
  const [selectedID, setSelectedID] = useState<string>("1");

  const { t } = useTranslation("report");
  const { t: tx } = useTranslation("common");
  function handleAddReport() {
    setSelectedID("1");
    console.log("activated");
  }
  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/teach">{"Teaching Report"}</PageHeader>;
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={reports.length}>
          <AddReportButton onAddReport={handleAddReport} />
          <List className="gap-2">
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
          </List>
        </LookupListSide>
        <LookupDetailsSide length={reports.length} selectedID={selectedID}>
          <ReportDetailsCard
            teacher={teacher}
            report={reports.filter((report) => report.id == selectedID)}
          />
        </LookupDetailsSide>
      </SplitLayout>
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
            teacher_ids: [teacher.id],
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
