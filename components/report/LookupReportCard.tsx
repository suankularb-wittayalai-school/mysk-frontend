import { StylableFC } from "@/utils/types/common"
import { Card, CardHeader } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";

const LookupReportCard: StylableFC<{
  report: string;
  selected?: boolean;
  // onClick: (id: string) => void;
}> = ({ report, selected, style, className }) => {
  return (
    <Card 
      appearance="outlined"
      direction="row"
      style={style}
      className={cn(
        `w-full items-center !rounded-none !border-transparent pr-3 text-left
        sm:!rounded-md`,
        selected &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        title={"MySK 4 (M.911)"}
        subtitle={"Period 1-2 • 27 January 2025"}
        className="[&_h3]:line-clamp-3"
      />
    </Card>
  )
}

export default LookupReportCard;