import {
  Card,
  CardHeader,
  CardContent,
  Actions,
  Button,
} from "@suankularb-components/react";
import { StylableFC } from "@/utils/types/common";
import Link from "next/link";
import { useTranslation } from "next-i18next";

/**
 * A Card that links to a page where the user can choose an Elective Subject.
 */
const ElectiveEntryCard: StylableFC = () => {
  const { t } = useTranslation("schedule", {
    keyPrefix: "subjectList.elective",
  });

  return (
    <Card appearance="filled" className="!bg-primary-container">
      <CardHeader title={t("title")} subtitle={t("subtitle")} />
      <CardContent className="!pt-0">
        <Actions align="right" className="!-mt-2.5">
          <Button appearance="filled" href="/learn/elective" element={Link}>
            {t("action.choose")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default ElectiveEntryCard;
