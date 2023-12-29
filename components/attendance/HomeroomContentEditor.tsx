// Imports
import { HomeroomView } from "@/components/attendance/TodaySummary";
import SnackbarContext from "@/contexts/SnackbarContext";
import recordHomeroom from "@/utils/backend/attendance/recordHomeroom";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { HomeroomContent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";

/**
 * Allows the user to edit the content of the Homeroom Content for a Classroom.
 *
 * @param homeroomContent The Homeroom Content to be edited.
 * @param classroomID The ID of the Classroom that this Homeroom Content is for.
 * @param onViewChange Should change the view of the Homeroom Content Editor.
 */
const HomeroomContentEditor: StylableFC<{
  homeroomContent: HomeroomContent;
  classroomID: string;
  onViewChange: (view: HomeroomView) => void;
}> = ({ homeroomContent, classroomID, onViewChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today.homeroom" });
  const { t: tx } = useTranslation("common");

  const [field, setField] = useState(homeroomContent?.homeroom_content || "");

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();
  const refreshProps = useRefreshProps();
  const [loading, toggleLoading] = useToggle();

  /**
   * Cancels editing the Homeroom Content and reverts to the previous view with
   * the previous content.
   */
  function handleCancel() {
    setField(homeroomContent.homeroom_content);
    onViewChange(
      homeroomContent.homeroom_content ? HomeroomView.view : HomeroomView.empty,
    );
  }

  /**
   * Saves the Homeroom Content to the database.
   */
  async function handleSave() {
    if (!field) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }
    withLoading(async () => {
      const { error } = await recordHomeroom(
        supabase,
        { ...homeroomContent, homeroom_content: field },
        classroomID,
      );
      if (error) {
        setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        return false;
      }
      await refreshProps();
      onViewChange(HomeroomView.view);
      return true;
    }, toggleLoading);
  }

  return (
    <>
      <TextField<string>
        appearance="outlined"
        label={t("field")}
        behavior="multi-line"
        value={field}
        onChange={setField}
        inputAttr={{ readOnly: loading }}
      />
      <Actions>
        <Button appearance="text" onClick={handleCancel}>
          {t("action.cancel")}
        </Button>
        <Button appearance="filled" disabled={loading} onClick={handleSave}>
          {t("action.save")}
        </Button>
      </Actions>
    </>
  );
};

export default HomeroomContentEditor;
