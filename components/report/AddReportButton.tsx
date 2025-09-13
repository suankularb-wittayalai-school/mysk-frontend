import { Button, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

const AddReportButton: FC<{ onAddReport: () => void }> = ({ onAddReport }) => {
  const { t } = useTranslation("report");

  return (
    <Button
      appearance="filled"
      icon={<MaterialIcon icon="Add" />}
      className="!mb-6 !bg-secondary-container !text-on-secondary-container"
      onClick={() => onAddReport()}
    >
      {t("action.add")}
    </Button>
  );
};

export default AddReportButton;
