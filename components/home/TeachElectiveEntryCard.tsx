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
import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation("home/subjectList");

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(`!bg-primary-container`, className)}
    >
      <CardHeader
        title={t("elective.title")}
        subtitle={t("elective.subtitle.teacher", {
          count: electivesInCharge.length,
        })}
        className="grow items-start"
      />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button appearance="filled" href="/teach/electives" element={Link}>
            {t("elective.action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default TeachElectiveEntryCard;
