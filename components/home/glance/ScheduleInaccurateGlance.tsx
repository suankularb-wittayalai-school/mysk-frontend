import cn from "@/utils/helpers/cn";
import { MaterialIcon } from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import TextGlance from "./TextGlance";

const ScheduleInaccurateGlance = (() => {
  const { t: ts } = useTranslation("schedule");

  return (
    <TextGlance
      icon={<MaterialIcon icon="warning" size={20} />}
      visible={true}
      className={cn(`!bg-error-container !text-on-error-container 
        !border-error-container`)}
    >
      <Trans i18nKey="inaccurateNotice" t={ts}>
        <a href="http://www.sk.ac.th/" target="_blank" className="link" />
      </Trans>
    </TextGlance>
  );
});

export default ScheduleInaccurateGlance;