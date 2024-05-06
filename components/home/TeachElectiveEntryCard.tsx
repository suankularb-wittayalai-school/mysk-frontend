import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

/**
 * A Card that links to a page where the user can view the Elective Subjects
 * they’re in charge of.
 *
 * @param electivesInCharge The Elective Subjects this Teacher is in charge of.
 */
const TeachElectiveEntryCard: StylableFC<{
  electivesInCharge: ElectiveSubject[];
}> = ({ electivesInCharge, style, className }) => {
  const { t } = useTranslation("schedule", {
    keyPrefix: "subjectList.elective",
  });

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(`!bg-primary-container`, className)}
    >
      <CardHeader
        title={t("title")}
        subtitle={t("subtitle", {
          context: "teacher",
          count: electivesInCharge.length,
        })}
      />
      <CardContent className="!p-3 !pt-0">
        <Actions align="right" className="!-mt-2">
          <Button appearance="filled" href="/teach/elective" element={Link}>
            {t("action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default TeachElectiveEntryCard;
