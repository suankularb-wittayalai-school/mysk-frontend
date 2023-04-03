// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import MultilangText from "@/components/common/MultilingualText";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const PeriodDetailsContent: FC<{ period: PeriodContentItem }> = ({
  period,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  return (
    <>
      {/* Teachers and coteachers */}
      <section aria-labelledby="period-teacher">
        <h2 id="period-teacher" className="skc-title-medium">
          {t("dialog.periodDetails.teachers")}
        </h2>
        <ul className="skc-body-medium">
          {period.subject.teachers.map((teacher) => (
            <li key={teacher.id}>{nameJoiner(locale, teacher.name)}</li>
          ))}
          {period.subject.coTeachers?.map((teacher) => (
            <li className="text-outline" key={teacher.id}>
              {nameJoiner(locale, teacher.name)}
            </li>
          ))}
        </ul>
      </section>

      {/* Room */}
      {period.class && (
        <section aria-labelledby="period-room">
          <h2 id="period-room" className="skc-title-medium">
            {t("dialog.periodDetails.class")}
          </h2>
          <p className="skc-body-medium">
            {t("class", { ns: "common", number: period.class.number })}
          </p>
        </section>
      )}

      {/* Room */}
      {period.room && (
        <section aria-labelledby="period-room">
          <h2 id="period-room" className="skc-title-medium">
            {t("dialog.periodDetails.room")}
          </h2>
          <p className="skc-body-medium">{period.room}</p>
        </section>
      )}

      {/* Subject code */}
      <section aria-labelledby="period-code">
        <h2 id="period-code" className="skc-title-medium">
          {t("dialog.periodDetails.code")}
        </h2>
        <MultilangText text={period.subject.code} className="skc-body-medium" />
      </section>
    </>
  );
};

export default PeriodDetailsContent;
