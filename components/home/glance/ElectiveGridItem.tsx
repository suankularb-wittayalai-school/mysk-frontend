import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

/**
 * A single Period Content Item in an Elective Grid.
 *
 * @param subject The Period Content Item to display.
 * @param enrolled Whether the respective Elective Subject is currently enrolled.
 */
const ElectiveGridItem: StylableFC<{
  subject: PeriodContentItem;
  enrolled?: boolean;
}> = ({ subject, enrolled, style, className }) => {
  const locale = useLocale();

  return (
    <Card
      appearance="filled"
      element="li"
      style={style}
      className={cn(
        `!rounded-lg`,
        enrolled ? `!bg-primary` : `!bg-surface-bright`,
        className,
      )}
    >
      <div
        className={cn(
          `grid grid-cols-[1fr,2.75rem] items-center`,
          enrolled && `text-on-primary`,
        )}
      >
        <CardHeader
          title={getLocaleString(subject.subject.name, locale)}
          subtitle={getLocaleString(subject.subject.code, locale)}
          className="!px-3 !py-2"
        />
        {enrolled && <MaterialIcon icon="done" />}
      </div>
      <SingleSubjectDetails
        period={subject}
        className="grow p-2 pt-0 *:!bg-surface-container"
      />
    </Card>
  );
};

export default ElectiveGridItem;
