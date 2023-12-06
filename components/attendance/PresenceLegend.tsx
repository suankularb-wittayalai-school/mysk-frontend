// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A legend for the Presence Selector.
 */
const PresenceLegend: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "legend" });

  return (
    <section
      aria-label={t("legend")}
      style={style}
      className={cn(`flex flex-row gap-3`, className)}
    >
      <div className="flex flex-row items-center gap-1">
        <MaterialIcon icon="check" size={20} className="text-primary" />
        <Text type="label-medium">{t("present")}</Text>
      </div>
      <div className="ml-1 flex flex-row items-center gap-1">
        <MaterialIcon
          icon="running_with_errors"
          size={20}
          className="text-tertiary"
        />
        <Text type="label-medium">{t("late")}</Text>
      </div>
      <div className="flex flex-row items-center gap-1">
        <MaterialIcon icon="close" size={20} className="text-error" />
        <Text type="label-medium">{t("absent")}</Text>
      </div>
    </section>
  );
};

export default PresenceLegend;
