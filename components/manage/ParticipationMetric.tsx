import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import { dash } from "radash";

const ParticipationMetric: StylableFC<{
  id: string;
  count: number;
  total: number;
}> = ({ id, count, total, style, className }) => {
  const { t } = useTranslation("manage", { keyPrefix: "participation" });

  return (
    <li
      aria-labelledby={"metric-" + dash(id)}
      style={style}
      className={cn(`grid grid-cols-[3rem,1fr] items-end gap-2`, className)}
    >
      <Progress
        appearance="circular"
        alt={t(`${id}.alt`)}
        value={(count / total) * 100}
        visible
      />
      <Text type="body-medium">
        <Trans
          i18nKey={`participation.${id}.content`}
          ns="manage"
          values={{ count, total, percentage: count / total }}
        >
          <Text type="title-large">{}</Text>
          <strong />
        </Trans>
      </Text>
    </li>
  );
};

export default ParticipationMetric;
