import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Button that allows the Student to choose an Elective Subject.
 *
 * @param sessionCode The session code of the Elective Subject to choose.
 * @param enrolledID The session code of the Elective Subject the Student is currently enrolled in.
 * @param onSucess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ChooseButton: StylableFC<{
  sessionCode: number | null;
  enrolledID: number | null;
  onSucess?: () => void;
}> = ({ sessionCode, enrolledID, onSucess, style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "list" });

  const mysk = useMySKClient();
  const refreshProps = useRefreshProps();

  const [loading, toggleLoading] = useToggle();

  /**
   * Choose or change to the selected Elective Subject, depending on context.
   */
  async function handleChoose() {
    if (!sessionCode || sessionCode === enrolledID) return;
    withLoading(
      async () => {
        const { error } = await mysk.fetch(
          `/v1/subjects/electives/${sessionCode}/enroll/`,
          {
            // POST for choosing, PUT for changing.
            method: enrolledID ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fetch_level: "id_only" }),
          },
        );
        if (error) logError("handleChoose", error);
        await refreshProps();
        onSucess?.();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <Button
      appearance="filled"
      icon={<MaterialIcon icon="done" />}
      onClick={handleChoose}
      disabled={sessionCode === enrolledID || loading}
      style={style}
      className={className}
    >
      {t("action.choose", {
        context: !enrolledID
          ? "initial"
          : sessionCode !== enrolledID
            ? "change"
            : "chosen",
      })}
    </Button>
  );
};

export default ChooseButton;
