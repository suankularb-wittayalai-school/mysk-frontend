// Imports
import ConfigureSection from "@/components/club/manage/club/ConfigureSection";
import StatisticsSection from "@/components/club/manage/club/StatisticsSection";
import { Club, ClubStatistics } from "@/utils/types/club";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Text } from "@suankularb-components/react";

/**
 * A view of Manage Club to configure Club identity and view statistics.
 *
 * @param club A Club instance.
 * @param statistics Statistics to show in the Cool Statistics Section.
 *
 * @returns A fragment with a Columns.
 */
const OverviewView: FC<{
  club: Club;
  statistics: ClubStatistics;
}> = ({ club, statistics }) => {
  const { t } = useTranslation("club/manage");

  return (
    <>
      <div className="flex flex-col gap-12 sm:gap-0">
        <ConfigureSection club={club} />
        <StatisticsSection statistics={statistics} />
      </div>

      {/* I read through the Apple Marketing Guidelines and apparently I have
          to add this line if I want to use their product frames. Am I
          understanding it right? Can anyone confirm?
          https://developer.apple.com/app-store/marketing/guidelines/ */}
      <Text
        type="label-small"
        className="mt-6 text-on-surface-variant"
        element="p"
      >
        {t("trademark")}
      </Text>
    </>
  );
};

export default OverviewView;
