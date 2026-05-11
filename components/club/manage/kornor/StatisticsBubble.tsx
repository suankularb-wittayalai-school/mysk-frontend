import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { FC } from "react";

const StatisticsBubble: FC<{
  size: "large" | "small";
  color: "primary" | "secondary" | "tertiary" | "surface";
  count: number;
  percentage?: number;
  label: string;
}> = ({ size, color, count, percentage, label }) => {
  const locale = useLocale();

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
      <span
        className={
          {
            large: `skc-display-large`,
            small: `skc-display-small`,
          }[size]
        }
      >
        {count.toLocaleString(locale)} {/* Percentage */}
        {percentage !== undefined && (
          <span
            className={cn(
              {
                large: `skc-title-large`,
                small: `skc-title-medium`,
              }[size],
              {
                primary: `text-primary`,
                secondary: `text-secondary`,
                tertiary: `text-tertiary`,
                surface: `text-on-surface-variant`,
              }[color],
            )}
          >
            ({percentage.toLocaleString(locale)}%)
          </span>
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          `whitespace-nowrap`,
          {
            large: `skc-title-large`,
            small: `skc-title-medium`,
          }[size],
        )}
      >
        {label}
      </span>
    </section>
  );
};

export default StatisticsBubble;
