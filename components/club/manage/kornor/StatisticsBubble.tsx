import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { FC } from "react";
import { Text } from "@suankularb-components/react";

const StatisticsBubble: FC<{
  size: "large" | "small";
  color: "primary" | "secondary" | "tertiary" | "surface";
  count: number;
  percentage?: number;
  label: string;
}> = ({ size, color, count, percentage, label }) => {
  const locale = useLocale();

  const DisplaySize = {
    large: "display-large",
    small: "display-small",
  } as const;
    const TitleSize = {
    large: "title-large",
    small: "title-small",
  } as const;
  const TextColor = {
    primary: `text-primary`,
    secondary: `text-secondary`,
    tertiary: `text-tertiary`,
    surface: `text-on-surface-variant`,
  } as const;

  return (
    <section
      className={cn(
        `flex flex-col rounded-full`,
        {
          large: `gap-1 px-12 pb-6 pt-5`,
          small: `px-8 py-5`,
        }[size],
        {
          primary: `bg-primary-container text-on-primary-container`,
          secondary: `bg-secondary-container text-on-secondary-container`,
          tertiary: `bg-tertiary-container text-on-tertiary-container`,
          surface: `border-1 border-outline-variant bg-surface text-on-surface`,
        }[color],
      )}
    >
      {/* Big number */}
      <Text type={DisplaySize[size]} element="span">
        {/* Percentage */}
        {count.toLocaleString(locale)}
        {percentage !== undefined && (
          <Text type={TitleSize[size]} className={TextColor[color]}>
            ({percentage.toLocaleString(locale)}%)
          </Text>
        )}
      </Text>

      {/* Label */}
      <Text type={TitleSize[size]} className={`whitespace-nowrap`}>
        {label}
      </Text>
    </section>
  );
};

export default StatisticsBubble;
