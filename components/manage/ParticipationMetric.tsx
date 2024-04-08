import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { dash } from "radash";

/**
 * A metric to display on the Participation page.
 *
 * @param id The unique identifier of the metric. Used in indexing into translations.
 * @param count The count of the metric.
 * @param total The total count of the metric.
 */
const ParticipationMetric: StylableFC<{
  id: string;
  count: number;
  total: number;
}> = ({ id, count, total, style, className }) => {
  const { t } = useTranslation("manage", { keyPrefix: "participation" });

  const labelID = "metric-" + dash(id);

  return (
    <li
      aria-labelledby={labelID}
      style={style}
      className={cn(
        `grid items-center gap-x-6 gap-y-3 rounded-xl bg-surface-variant
        p-4 sm:grid-cols-[3rem,1fr] sm:px-6`,
        className,
      )}
    >
      <Progress
        appearance="circular"
        alt={t(`${id}.alt`)}
        value={(count / total) * 100}
        visible
        className="[&_.skc-progress\_\_remainder]:!stroke-surface"
      />
      <div>
        <Text type="title-small" className="text-on-surface-variant">
          {t(`${id}.overline`)}
        </Text>
        <Text
          type="title-medium"
          element={(props) => <h2 id={labelID} {...props} />}
        >
          {t(`${id}.title`, { percentage: count / total })}
        </Text>
        <Text type="body-small" element="p" className="mt-3">
          {t(`${id}.subtitle`, { count, total })}
        </Text>
      </div>
    </li>
  );
};

export default ParticipationMetric;
