import { StylableFC } from "@/utils/types/common";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import { isToday } from "date-fns";
import { useState } from "react";
import {
  AttendanceView,
  SelectorType,
} from "@/components/attendance/AttendanceViewSelector";
import router from "next/router";
import CheerDatePickerDialog from "@/components/cheer/CheerDatePickerDialog";
import useTranslation from "next-translate/useTranslation";

const CheerDateSelector: StylableFC<{ date: string }> = ({ date }) => {
  const { t } = useTranslation("attendance/cheer");

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <Actions align="full" className="!mb-8">
      {/* Date picker */}
      <Button
        appearance="tonal"
        icon={<MaterialIcon icon="event" />}
        onClick={() => setDatePickerOpen(true)}
        className={
          !isToday(new Date("date"))
            ? `[&&]:!aspect-auto [&&]:!py-2.5 [&&]:!pl-4 [&&]:!pr-6 [&_span:not(:empty)]:!inline`
            : undefined
        }
      >
        {t("date", { date: new Date(date) })}
      </Button>
      <CheerDatePickerDialog
        open={datePickerOpen}
        view={AttendanceView.date}
        type={SelectorType.classroom}
        onClose={() => setDatePickerOpen(false)}
        onSubmit={({ date }) => {
          setDatePickerOpen(false);
          router.push(`/cheer/attendance/${date}`);
        }}
      />
    </Actions>
  );
};

export default CheerDateSelector;
