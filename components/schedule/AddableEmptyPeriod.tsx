// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Backend
import { moveScheduleItem } from "@/utils/backend/schedule/schedule";

// Hooks
import { useTeacherAccount } from "@/utils/hooks/auth";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const AddableEmptySchedulePeriod = ({
  isInSession,
  day,
  startTime,
  setAddPeriod,
  toggleFetched,
}: {
  isInSession: boolean;
  day: Day;
  startTime: number;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
  toggleFetched?: () => void;
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const supabase = useSupabaseClient();

  const [processing, setProcessing] = useState<boolean>(false);
  const [teacher] = useTeacherAccount();

  return (
    <button
      className={`grid h-14 w-full place-items-center rounded-sm text-4xl
      transition-[border-color] ${
          processing
            ? "bg-secondary-translucent-12 border-4 border-secondary"
            : `hover:bg-primary-translucent-08 focus:bg-primary-translucent-12 group
                hover:border-primary focus:border-primary ${
                  isInSession
                    ? "border-4 border-secondary"
                    : "border-[1px] border-outline-variant"
                }`
        }`}
      title={t("schedule.hoverMenu.add")}
      onClick={
        setAddPeriod
          ? () => setAddPeriod({ show: true, day, startTime })
          : undefined
      }
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={async (e) => {
        setProcessing(true);
        if (teacher)
          await moveScheduleItem(
            supabase,
            day,
            {
              ...(JSON.parse(
                e.dataTransfer.getData("text")
              ) as PeriodContentItem),
              startTime,
            },
            teacher.id
          );
        e.dataTransfer.clearData();
        if (toggleFetched) toggleFetched();
      }}
    >
      <MaterialIcon
        icon="add"
        className="scale-90 text-primary opacity-0 transition-all
          group-hover:scale-100 group-hover:opacity-100
          group-focus:scale-100 group-focus:opacity-100"
      />
    </button>
  );
};

export default AddableEmptySchedulePeriod;
