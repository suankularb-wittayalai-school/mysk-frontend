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

const CheerAttendanceEntrycard: StylableFC<{ isCheerStaff: boolean }> = ({
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
      <CardHeader
        title={t("title")}
        subtitle={t("sub_title")}
        className="grow items-start"
      />
      <CardContent className="!p-3 !pt-0">
        <Actions className="!-mt-2.5">
          <Button
            appearance="filled"
            href={isCheerStaff ? "/cheer/attendance" : "/cheer"}
            element={Link}
          >
            {isCheerStaff ? t("action.edit") : t("action.view")}
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

export default CheerAttendanceEntrycard;
