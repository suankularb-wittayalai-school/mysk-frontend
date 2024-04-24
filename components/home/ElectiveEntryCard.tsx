import cn from "@/utils/helpers/cn";
import { ElectivePermissions } from "@/utils/helpers/elective/electivePermissionsAt";
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
 * @param electivePermissions The permissions available to this Student for Electives.
 * @param enrolledElective The Elective Subject this Student is enrolled in.
 */
const ElectiveEntryCard: StylableFC<{
  electivePermissions: ElectivePermissions;
  enrolledElective: ElectiveSubject | null;
}> = ({ electivePermissions, enrolledElective, style, className }) => {
  const locale = useLocale();
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
        subtitle={
          enrolledElective
            ? getLocaleString(enrolledElective.name, locale)
            : t("subtitle")
        }
      />
      <CardContent className="!pt-0">
        <Actions align="right" className="!-mt-2.5">
          <Button appearance="filled" href="/learn/elective" element={Link}>
            {enrolledElective
              ? t("action.change")
              : electivePermissions.choose
                ? t("action.choose")
                : t("action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default ElectiveEntryCard;
