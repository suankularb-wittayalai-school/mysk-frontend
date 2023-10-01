// Imports
import MultilangText from "@/components/common/MultilingualText";
import { getLocaleName } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { PeriodContentItem } from "@/utils/types/schedule";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const PeriodDetailsContent: FC<{
  period: PeriodContentItem;
}> = ({ period }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  return (
    <>
      {/* Teachers and coteachers */}
      <section aria-labelledby="period-teacher">
        <Text
          type="title-medium"
          element={(props) => <h2 id="period-teacher" {...props} />}
        >
          {t("dialog.periodDetails.teachers")}
        </Text>
        <Text type="body-medium" element="ul">
          {period.teachers.map((teacher) => (
            <li key={teacher.id}>{getLocaleName(locale, teacher)}</li>
          ))}
          {period.co_teachers?.map((teacher) => (
            <li className="text-outline" key={teacher.id}>
              {getLocaleName(locale, teacher)}
            </li>
          ))}
        </Text>
      </section>

      {/* Room */}
      {period.classrooms && (
        <section aria-labelledby="period-class">
          <Text
            type="title-medium"
            element={(props) => <h2 id="period-class" {...props} />}
          >
            {t("dialog.periodDetails.class")}
          </Text>
          <Text type="body-medium" element="p">
            {period.classrooms
              .map((classroom) =>
                t("class", { ns: "common", number: classroom.number }),
              )
              .join(", ")}
          </Text>
        </section>
      )}

      {/* Room */}
      {period.rooms && (
        <section aria-labelledby="period-room">
          <Text
            type="title-medium"
            element={(props) => <h2 id="period-room" {...props} />}
          >
            {t("dialog.periodDetails.room")}
          </Text>
          <Text type="body-medium" element="p">
            {period.rooms.join(", ")}
          </Text>
        </section>
      )}

      {/* Subject code */}
      <section aria-labelledby="period-code">
        <Text
          type="title-medium"
          element={(props) => <h2 id="period-code" {...props} />}
        >
          {t("dialog.periodDetails.code")}
        </Text>
        <Text type="body-medium" element="div">
          <MultilangText text={period.subject.code} />
        </Text>
      </section>
    </>
  );
};

export default PeriodDetailsContent;
