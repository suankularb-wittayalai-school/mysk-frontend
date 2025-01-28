import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

const TeachReportEntryCard = ({}) => {
  const { t } = useTranslation("report/teachReportEntryCard");
  return (
    <Card appearance="filled" className="!bg-secondary-container">
      <CardHeader
        title={t("title")}
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
