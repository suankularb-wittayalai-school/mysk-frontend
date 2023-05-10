// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card, MaterialIcon } from "@suankularb-components/react";

/**
 * A Card warning the user going through the onboarding process about saving.
 */
const NextWarningCard: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Card
      appearance="outlined"
      direction="row"
      className="mx-4 items-center gap-3 px-4 py-3 sm:mx-0"
    >
      <MaterialIcon icon="warning" className="text-error" />
      <p>{t("common.nextReminder")}</p>
    </Card>
  );
};

export default NextWarningCard;
