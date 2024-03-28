import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { Card, CardHeader } from "@suankularb-components/react";
import { list } from "radash";

/**
 * A grid of Period Content Items in a Schedule Period.
 *
 * @param period The Schedule Period to display the Period Content Items of.
 */
const ElectiveGrid: StylableFC<{
  period: SchedulePeriod;
}> = ({ period, style, className }) => {
  const locale = useLocale();

  return (
    <div
      className={cn(`-mx-4 snap-x snap-mandatory overflow-x-auto
        md:snap-none`)}
    >
      <ul
        role="list"
        style={style}
        className={cn(
          `flex w-fit grid-cols-2 flex-row gap-2 px-3 md:grid md:w-auto`,
          className,
        )}
      >
        {period.content.map((subject) => (
          // Period Content Item
          <Card
            key={subject.id}
            appearance="filled"
            className={cn(`w-[calc(100vw-3.5rem)] max-w-96 snap-start
              scroll-ml-3 !rounded-lg sm:w-96 sm:max-w-full md:w-auto`)}
          >
            <CardHeader
              title={getLocaleString(subject.subject.name, locale)}
              subtitle={getLocaleString(subject.subject.code, locale)}
              className="!px-3 !py-2"
            />
            <SingleSubjectDetails period={subject} className="grow p-2 pt-0" />
          </Card>
        ))}
      </ul>

      {/* Pages indicator */}
      <div
        className={cn(`sticky left-0 flex flex-row justify-center gap-0.5 pt-1
          sm:hidden`)}
      >
        {list(period.content.length - 1).map((index) => (
          <div key={index} className="h-1 w-1 rounded-full bg-outline" />
        ))}
      </div>
    </div>
  );
};

export default ElectiveGrid;
