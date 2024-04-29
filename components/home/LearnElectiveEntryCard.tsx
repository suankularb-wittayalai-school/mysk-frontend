import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
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
 * A Card that links to a page where the user can choose an Elective Subject.
 *
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 * @param enrolledElective The Elective Subject this Student is enrolled in.
 */
const LearnElectiveEntryCard: StylableFC<{
  inEnrollmentPeriod?: boolean;
  enrolledElective: ElectiveSubject | null;
}> = ({ inEnrollmentPeriod, enrolledElective, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", {
    keyPrefix: "subjectList.elective",
  });

  return (
    <Card
      appearance="filled"
      element="li"
      style={style}
      className={cn(`!bg-primary-container`, className)}
    >
      <CardHeader
        title={t("title")}
        subtitle={
          enrolledElective
            ? getLocaleString(enrolledElective.name, locale)
            : t("subtitle", { context: "student" })
        }
      />
      <CardContent className="!pt-0">
        <Actions align="right" className="!-mt-2.5">
          <Button appearance="filled" href="/learn/elective" element={Link}>
            {inEnrollmentPeriod
              ? enrolledElective
                ? t("action.change")
                : t("action.choose")
              : t("action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default LearnElectiveEntryCard;
