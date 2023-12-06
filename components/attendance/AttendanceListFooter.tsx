// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * The footer of the Attendance list. Contains actions for bulk editing and
 * saving.
 *
 * @param loading Whether the Attendance data is being saved. Disables the Save Button.
 * @param onMarkAllPresent Mark all students as present.
 * @param onClear Clear all Attendance data.
 * @param onSave Save the Attendance data.
 */
const AttendanceListFooter: StylableFC<{
  loading?: boolean;
  onMarkAllPresent: () => void;
  onClear: () => void;
  onSave: () => void;
}> = ({ loading, onMarkAllPresent, onClear, onSave }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today.action" });

  // On mobile, primary action (save) is on the first from the left and
  // secondary actions are right next to the right to save space.

  // -------------------------------------------
  // [ Save ] [ Clear all ] [ Mark all present ]

  //

  // On desktop, primary action (save) is on the right and secondary actions
  // are on the left.

  // ---------------------------------------------------------------------------
  // [ Mark all present ] [ Clear all ]                                 [ Save ]

  return (
    <div
      className={cn(`sticky bottom-20 z-10 flex flex-row gap-2 overflow-auto
        border-t-1 border-t-outline bg-surface px-4 pb-4 pt-2 sm:bottom-0 sm:px-0`)}
    >
      <div
        className={cn(`flex w-fit flex-row-reverse gap-2 sm:contents
          [&_.skc-button]:whitespace-nowrap`)}
      >
        {/* Secondary actions */}
        <Actions align="left" className="!contents grow sm:!flex">
          {/* Mark all as present */}
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="done_all" />}
            onClick={onMarkAllPresent}
            className="!col-span-2"
          >
            {t("markAll")}
          </Button>

          {/* Clear all */}
          <Button
            appearance="outlined"
            icon={<MaterialIcon icon="delete" />}
            onClick={onClear}
            dangerous
          >
            {t("clear")}
          </Button>
        </Actions>

        {/* Save */}
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="save" />}
          disabled={loading}
          onClick={onSave}
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default AttendanceListFooter;
