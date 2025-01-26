import { Button, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";


const AddReportButton = () => {

  const { t } = useTranslation("report");

  return (
    <Button
      appearance="filled"
      icon={<MaterialIcon icon="Add" />}
      className="!mb-6 !bg-secondary-container !text-on-secondary-container"
    >
      {t("action.add")}
    </Button>
  );
};

export default AddReportButton;
