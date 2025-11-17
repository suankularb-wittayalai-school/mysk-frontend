import { StylableFC } from "@/utils/types/common";
import TextGlance from "@/components/home/glance/TextGlance";
import { MaterialIcon } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import Trans from "next-translate/Trans";

const CheerAttendanceRemedialGuidelineGlance: StylableFC = ({
  style,
  className,
}) => (
  <TextGlance
    icon={<MaterialIcon icon="push_pin" size={20} />}
    visible
    style={style}
    className={cn(
      `*:!text-on-surface-container !bg-surface-container`,
      className,
    )}
  >
    <Trans
      i18nKey="attendance/cheer/glance:remedialGuideline"
      components={{
        0: (
          <a
            href="https://drive.google.com/file/d/1CV6jNrfpYE3mALZnPw1iHzCYTebDHwY7/view?usp=sharing"
            target="_blank"
            className="link"
          />
        ),
      }}
    />
  </TextGlance>
);

export default CheerAttendanceRemedialGuidelineGlance;
