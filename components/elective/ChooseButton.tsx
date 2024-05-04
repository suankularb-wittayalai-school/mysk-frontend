import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleString from "@/utils/helpers/getLocaleString";
import logError from "@/utils/helpers/logError";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Button, MaterialIcon, Snackbar } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * A Button that allows the Student to choose an Elective Subject.
 *
 * @param electiveSubjectID The session code of the Elective Subject to choose.
 * @param enrolledID The session code of the Elective Subject the Student is currently enrolled in.
 * @param disabled Whether the Button is disabled.
 * @param onSucess Triggers after the Student has successfully chosen the Elective Subject.
 */
const ChooseButton: StylableFC<{
  electiveSubject: ElectiveSubject | null;
  enrolledElective: ElectiveSubject | null;
  disabled?: boolean;
  onSucess?: () => void;
}> = ({
  electiveSubject,
  enrolledElective,
  disabled: forceDisabled,
  onSucess,
  style,
  className,
}) => {
  const { t } = useTranslation("elective", { keyPrefix: "list" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const mysk = useMySKClient();
  const refreshProps = useRefreshProps();

  const [loading, toggleLoading] = useToggle();
  const disabled =
    // Disallow choosing if forced to be disabled.
    forceDisabled ||
    // Disallow choosing if none is selected.
    !electiveSubject ||
    // Disallow choosing if already enrolled in the same Elective Subject.
    electiveSubject.id === enrolledElective?.id;

  /**
   * Choose or change to the selected Elective Subject, depending on context.
   */
  async function handleChoose() {
    if (disabled) return;
    const subject = getLocaleString(electiveSubject.name, "en-US");
    withLoading(
      async () => {
        const { error } = await mysk.fetch(
          `/v1/subjects/electives/${electiveSubject.id}/enroll`,
          {
            // POST for choosing, PUT for changing.
            method: enrolledElective ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fetch_level: "id_only" }),
          },
        );
        if (error) {
          if (error.code === 403 || error.code === 409) {
            va.track("Attempt to Choose Invalid Elective", { subject });
            setSnackbar(<Snackbar>{t("snackbar.notAllowed")}</Snackbar>);
          } else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          logError("handleChoose", error);
        }
        if (enrolledElective)
          va.track("Change Elective", {
            from: getLocaleString(enrolledElective.name, "en-US"),
            to: subject,
          });
        va.track("Choose Elective", { subject });
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
      loading={loading}
      disabled={disabled}
      style={style}
      className={className}
    >
      {t("action.choose", {
        context: !enrolledElective
          ? "initial"
          : electiveSubject?.id !== enrolledElective.id
            ? "change"
            : "chosen",
      })}
    </Button>
  );
};

export default ChooseButton;
