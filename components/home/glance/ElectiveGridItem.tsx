import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import { Card, CardHeader } from "@suankularb-components/react";

/**
 * A single Period Content Item in an Elective Grid.
 *
 * @param subject The Period Content Item to display.
 */
const ElectiveGridItem: StylableFC<{
  subject: PeriodContentItem;
}> = ({ subject, style, className }) => {
  const locale = useLocale();

  return (
    <Card
      appearance="filled"
      element="li"
      style={style}
      className={cn(`!rounded-lg !bg-surface-bright`, className)}
    >
      <CardHeader
        title={getLocaleString(subject.subject.name, locale)}
        subtitle={getLocaleString(subject.subject.code, locale)}
        className="!px-3 !py-2"
      />
      <SingleSubjectDetails
        period={subject}
        className="grow p-2 pt-0 *:!bg-surface-container"
      />
    </Card>
  );
};

export default ElectiveGridItem;
