import { HomeroomView } from "@/components/attendance/TodaySummary";
import SnackbarContext from "@/contexts/SnackbarContext";
import recordHomeroom from "@/utils/backend/attendance/recordHomeroom";
import cn from "@/utils/helpers/cn";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { HomeroomContent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";

const HomeroomContentEditor: StylableFC<{
  homeroomContent: HomeroomContent;
  classroomID: string;
  onViewChange: (view: HomeroomView) => void;
}> = ({ homeroomContent, classroomID, onViewChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today.homeroom" });
  const { t: tx } = useTranslation("common");

  const [field, setField] = useState(homeroomContent?.homeroom_content || "");

  const { duration, easing } = useAnimationConfig();
  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();
  const refreshProps = useRefreshProps();
  const [loading, toggleLoading] = useToggle();

  function handleCancel() {
    setField(homeroomContent.homeroom_content);
    onViewChange(
      homeroomContent.homeroom_content ? HomeroomView.view : HomeroomView.empty,
    );
  }

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
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(`space-y-2`, className)}
    >
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
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="save" />}
          disabled={loading}
          onClick={handleSave}
        >
          {t("action.save")}
        </Button>
      </Actions>
    </motion.div>
  );
};

export default HomeroomContentEditor;
