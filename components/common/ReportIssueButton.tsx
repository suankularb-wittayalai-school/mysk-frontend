import ReportIssueDialog from "@/components/common/ReportIssueDialog";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { ComponentProps, FC, useState } from "react";

/**
 * A Button that opens a Dialog for reporting an issue.
 *
 * @param location The location where the issue is reported. Used in analytics.
 * @param onClick Triggers when the Button is clicked.
 * @param onSubmit Triggers when the form link is opened.
 *
 * @see {@link Button} for additional props.
 * @see {@link ReportIssueDialog} for `location` and `onSubmit` props.
 */
const ReportIssueButton: FC<
  Partial<
    ComponentProps<typeof Button> &
      Pick<ComponentProps<typeof ReportIssueDialog>, "location" | "onSubmit">
  >
> = ({ children, location, onClick, onSubmit, ...props }) => {
  const { t } = useTranslation("common");

  const plausible = usePlausible();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="report" />}
        onClick={() => {
          plausible("Open Report Dialog", { props: { location } });
          setDialogOpen(true);
          onClick?.();
        }}
        {...props}
      >
        {children || t("action.report")}
      </Button>
      <ReportIssueDialog
        open={dialogOpen}
        location={location}
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
