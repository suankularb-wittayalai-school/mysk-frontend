import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Actions,
  Button,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { BackendReturn } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";

const TeachReportEntryCard = ({}) => {
  const { t } = useTranslation("report/teachReportEntryCard");
  return (
    <Card appearance="filled" className="!bg-secondary-container">
      <CardHeader
        title={t("title")}
        // subtitle={t("subtitle", {
        //   count: reports.length,
        // })}
        className="grow items-start"
      />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button
            appearance="filled"
            href="/teach/report"
            element={Link}
            className="!bg-secondary text-on-secondary"
          >
            {t("view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
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
      reports,
    },
  };
};

export default TeachReportEntryCard;
