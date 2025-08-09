import { StylableFC } from "@/utils/types/common";
import {
  Card,
  CardHeader,
  CardContent,
  Actions,
  Button,
} from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import getISODateString from "@/utils/helpers/getISODateString";

const CheerAttendanceEntryCard: StylableFC<{ isCheerStaff: boolean }> = ({
  isCheerStaff,
  style,
  className,
}) => {
  const { t } = useTranslation("home/activityList");
  return (
    <Card
      appearance="filled"
      element="li"
      style={style}
      className={cn(`!bg-primary-container`, className)}
    >
      <CardHeader title={t("title")} className="grow items-start" />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button
            appearance="filled"
            href={
              isCheerStaff
                ? `/cheer/aacdeennt/${getISODateString(new Date())}`
                : "/cheer"
            }
            element={Link}
          >
            {isCheerStaff ? t("action.edit") : t("action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default CheerAttendanceEntryCard;
