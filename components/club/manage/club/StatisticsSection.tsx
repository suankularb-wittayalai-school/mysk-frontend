// Imports
import { ClubStatistics } from "@/utils/types/club";
import { Columns } from "@suankularb-components/react";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Text } from "@suankularb-components/react";

/**
 * Displays some cool statistics on a Club’s membership.
 *
 * @param statistics Statistics on the Members of a Club.
 *
 * @returns A `<section>`.
 */
const StatisticsSection: FC<{
  statistics: ClubStatistics;
}> = ({ statistics }) => {
  const { t } = useTranslation("club/manage");

  return (
    <section
      aria-labelledby="header-statistics"
      className="flex flex-col gap-4"
    >
      <div id="header-statistics">
        <Text type="headline-medium" element="h2">
          {t("overview.statistics.title")}
        </Text>
      </div>

      <Columns columns={2}>
        <div className="flex flex-col gap-4">
          {/* Leaderboard */}
          {/* <Card appearance="outlined" className="p-4 !grid !grid-cols-[5rem,1fr] gap-4">
            <div className="flex w-20 flex-col items-center gap-2.5">
              <div className="h-16 w-16 rounded-full bg-surface-variant" />
              <div
                className="skc-headline-large relative isolate h-16 self-stretch
                  from-secondary px-3 py-2 text-center
                  text-secondary before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:opacity-40"
              >
                2
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="skc-title-large">
                {t("onLeaderboard.headline", { order: 2 })}
              </p>
              <p className="skc-body-medium">
                {t("onLeaderboard.desc", {
                  club: "ถ่ายภาพ",
                  count: 25,
                  order: 2,
                })}
              </p>
            </div>
          </Card> */}

          {/* Member count */}
          <Text type="title-large" element="p">
            <Trans
              i18nKey="overview.statistics.members"
              ns="club/manage"
              values={{ count: statistics.count }}
              components={{
                0: <Text type="display-medium">{null}</Text>,
              }}
            />
          </Text>
        </div>

        {/* Member count by Class */}
        <div className="flex flex-col gap-2">
          {statistics.byClass.map((classStatistics) => (
            <div
              key={classStatistics.class.id}
              className={`rounded-sm border-1 border-outline-variant bg-gradient-to-l from-surface-variant px-3 py-1.5`}
              style={{
                width: `${
                  (classStatistics.count / statistics.byClass[0].count) * 100
                }%`,
              }}
            >
              <Text
                type="title-medium"
                className="whitespace-nowrap"
                element="span"
              >
                {t("class", { number: classStatistics.class.number })}
              </Text>
            </div>
          ))}
        </div>
      </Columns>
    </section>
  );
};

export default StatisticsSection;
