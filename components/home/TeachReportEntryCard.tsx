import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Actions,
  Button,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

const TeachReportEntryCard = () => {
  const { t } = useTranslation("report/teachReportEntryCard");
  return (
    <Card appearance="filled" className="!bg-primary-container">
      <CardHeader title={t("title")} className="grow items-start" />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button appearance="filled" href="/teach/report" element={Link}>
            {t("view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default TeachReportEntryCard;
