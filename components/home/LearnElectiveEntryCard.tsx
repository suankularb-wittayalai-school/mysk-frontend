import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
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
 * A Card that links to a page where the user can choose an Elective Subject.
 *
 * @param inEnrollmentPeriod Whether the time now is in an Enrollment Period.
 */
const LearnElectiveEntryCard: StylableFC<{
  inEnrollmentPeriod?: boolean;
}> = ({ inEnrollmentPeriod, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("home/subjectList");

  const mysk = useMySKClient();
  const enrolledElective = (mysk.person as Student)?.chosen_elective || null;

  return (
    <Card
      appearance="filled"
      element="li"
      style={style}
      className={cn(`!bg-primary-container`, className)}
    >
      <CardHeader
        title={t("elective.title")}
        subtitle={
          enrolledElective
            ? getLocaleString(enrolledElective.name, locale)
            : t("elective.subtitle.student")
        }
        className="grow items-start"
      />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button appearance="filled" href="/learn/electives" element={Link}>
            {inEnrollmentPeriod
              ? enrolledElective
                ? t("elective.action.change")
                : t("elective.action.choose")
              : t("elective.action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default LearnElectiveEntryCard;
