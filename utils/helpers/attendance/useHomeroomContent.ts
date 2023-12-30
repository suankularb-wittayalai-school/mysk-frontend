import SnackbarContext from "@/contexts/SnackbarContext";
import upsertHomeroom from "@/utils/backend/attendance/upsertHomeroom";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { HomeroomContent } from "@/utils/types/attendance";
import { Snackbar } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { createElement, useContext, useState } from "react";

/**
 * Helpers for dealing with Homeroom Content.
 *
 * @param homeroomContent The Homeroom Content to edit.
 * @param classroomID The ID of the Classroom this Homeroom Content belongs to.
 * @param onCancel Triggers when the user cancels editing the Homeroom Content.
 * @param onSave Triggers when the user saves the Homeroom Content.
 */
export default function useHomeroomContent(
  homeroomContent: HomeroomContent,
  classroomID: string,
  onCancel?: () => void,
  onSave?: () => void,
) {
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
    onCancel?.();
  }

  /**
   * Saves the Homeroom Content to the database.
   */
  async function handleSave() {
    if (!field) {
      setSnackbar(createElement(Snackbar, null, tx("snackbar.formInvalid")));
      return;
    }
    withLoading(async () => {
      const { error } = await upsertHomeroom(
        supabase,
        { ...homeroomContent, homeroom_content: field },
        classroomID,
      );
      if (error) {
        setSnackbar(createElement(Snackbar, null, tx("snackbar.failure")));
        return false;
      }
      await refreshProps();
      onSave?.();
      return true;
    }, toggleLoading);
  }

  return { field, setField, handleCancel, handleSave, loading };
}
