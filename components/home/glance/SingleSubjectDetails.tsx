import InformationCard from "@/components/lookup/people/InformationCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import { useTranslation } from "next-i18next";

/**
 * The details of a single Subject in a Schedule Period.
 *
 * @param period The Period Content Item to display the details of.
 */
const SingleSubjectDetails: StylableFC<{
  period: PeriodContentItem;
}> = ({ period, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  return (
    <div style={style} className={cn(`grid grid-cols-2 gap-2`, className)}>
      {/* Teachers */}
      <InformationCard title={t("details.teachers.title")}>
        {t("details.teachers.content", {
          teachers: period.teachers.map((teacher) =>
            getLocaleName(locale, teacher, { prefix: "teacher" }),
          ),
        })}
      </InformationCard>

      {/* Room */}
      <InformationCard title={t("details.room.title")}>
        {t("details.room.content", { rooms: period.rooms })}
      </InformationCard>
    </div>
  );
};

export default SingleSubjectDetails;
