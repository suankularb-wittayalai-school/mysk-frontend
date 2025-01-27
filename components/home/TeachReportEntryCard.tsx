import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Actions,
  Button,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

const numbers = 1

const TeachReportEntryCard = () => {
  const { t } = useTranslation("report/teachReportEntryCard");
  return (
    <Card appearance="filled" className="!bg-secondary-container">
      <CardHeader 
        title={t("title")} 
        subtitle={t("subtitle", {
          count: numbers,
        })}
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

export default TeachReportEntryCard;
