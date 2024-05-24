import ReportIssueDialog from "@/components/common/ReportIssueDialog";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { ComponentProps, FC, useState } from "react";

/**
 * A Button that opens a Dialog for reporting an issue.
 *
 * @param onClick Triggers when the Button is clicked.
 * @param onSubmit Triggers when the form link is opened.
 *
 * @see {@link Button} for additional props.
 * @see {@link ReportIssueDialog} for `onSubmit` prop.
 */
const ReportIssueButton: FC<
  Partial<
    Omit<ComponentProps<typeof Button>, "children"> &
      Pick<ComponentProps<typeof ReportIssueDialog>, "onSubmit">
  >
> = ({ onClick, onSubmit, ...props }) => {
  const { t } = useTranslation("common");

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="report" />}
        onClick={() => {
          setDialogOpen(true);
          onClick?.();
        }}
        {...props}
      >
        {t("action.report")}
      </Button>
      <ReportIssueDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(category) => {
          setDialogOpen(false);
          onSubmit?.(category);
        }}
      />
    </>
  );
};

export default ReportIssueButton;
