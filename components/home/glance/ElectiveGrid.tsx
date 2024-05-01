import ElectiveGridItem from "@/components/home/glance/ElectiveGridItem";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { list } from "radash";

/**
 * A grid of Period Content Items in a Schedule Period.
 *
 * @param period The Schedule Period to display the Period Content Items of.
 */
const ElectiveGrid: StylableFC<{
  period: SchedulePeriod;
}> = ({ period, style, className }) => (
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
        <ElectiveGridItem
          key={subject.id}
          subject={subject}
          className={cn(`w-[calc(100vw-3.5rem)] max-w-96 snap-start scroll-ml-3
            sm:w-96 sm:max-w-full md:w-auto`)}
        />
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

export default ElectiveGrid;
