import { StylableFC } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";
import { MaterialIcon } from "@suankularb-components/react";
import { Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

const CheerMedicalConditionLegend: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("attendance/cheer");
  return (
    <ul
      style={style}
      className={cn(
        `mx-4 flex flex-row flex-wrap justify-center gap-x-3 gap-y-1 rounded-md border-1 border-outline-variant p-2 pr-3 *:flex *:flex-row *:items-center *:gap-2 sm:mx-auto md:border-0 md:p-0 [&_div]:!w-5 [&_span]:whitespace-nowrap [&_span]:text-on-surface-variant`,
        className,
      )}
    >
      <li>
        <MaterialIcon icon="sentiment_very_dissatisfied" />
        <Text type="body-medium">{t("legend.healthProblem.typeOne")}</Text>
      </li>
      <li>
        <MaterialIcon icon="healing" />
        <Text type="body-medium">{t("legend.healthProblem.typeTwo")}</Text>
      </li>
    </ul>
  );
};

export default CheerMedicalConditionLegend;
