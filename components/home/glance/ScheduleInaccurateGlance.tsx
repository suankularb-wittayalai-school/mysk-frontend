import TextGlance from "@/components/home/glance/TextGlance";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon } from "@suankularb-components/react";
import Trans from "next-translate/Trans";

/**
 * Warns the user that the Schedule data is still a work in progress and may not
 * be accurate.
 */
const ScheduleInaccurateGlance: StylableFC = ({ style, className }) => (
  <TextGlance
    icon={<MaterialIcon icon="warning" size={20} />}
    visible
    style={style}
    className={cn(
      `!border-0 !bg-error-container *:!text-on-error-container`,
      className,
    )}
  >
    <Trans
      i18nKey="glance/scheduleInaccurate:text"
      components={{
        0: <a href="http://www.sk.ac.th/" target="_blank" className="link" />,
      }}
    />
  </TextGlance>
);

export default ScheduleInaccurateGlance;
