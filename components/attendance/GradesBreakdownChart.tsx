import usePreferences from "@/utils/helpers/usePreferences";
import {
  AttendanceEvent,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import useTranslation from "next-translate/useTranslation";
import { list } from "radash";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

/**
 * A chart that displays Attendance of each grade on a date.
 *
 * @param grades An array of Attendance summaries for each Attendance Event and grade.
 */
const GradesBreakdownChart: StylableFC<{
  grades: { [key in AttendanceEvent]: ManagementAttendanceSummary }[];
}> = ({ grades, style, className }) => {
  const { t } = useTranslation("manage/attendance");
  const { t: tx } = useTranslation("common");

  const { preferences } = usePreferences();
  const chartScheme = (
    [null, "auto"].includes(preferences?.colorScheme || null)
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preferences!.colorScheme
  ) as "light" | "dark";
  useEffect(() => {
    Chart.defaults.borderColor = {
      light: "#C1C7CE88",
      dark: "#7D848A88",
    }[chartScheme];
    Chart.defaults.color = {
      light: "#41484D",
      dark: "#C5CBD2",
    }[chartScheme];
  }, [chartScheme]);

  const options = {
    indexAxis: "y" as const,
    responsive: true,
  };

  const labels = list(1, 6).map((grade) => tx("class", { number: grade }));

  const data = {
    labels,
    datasets: [
      {
        label: t("chart.assembly.late"),
        data: grades.map((grade) => grade.assembly.late * -1),
        backgroundColor: { light: "#FEB0D2", dark: "#A2607F" }[chartScheme],
      },
      {
        label: t("chart.assembly.presence"),
        data: grades.map((grade) => grade.assembly.presence),
        backgroundColor: { light: "#236488", dark: "#97D2FA" }[chartScheme],
      },
      {
        label: t("chart.homeroom.presence"),
        data: grades.map((grade) => grade.homeroom.presence),
        backgroundColor: { light: "#23648888", dark: "#97D2FA88" }[chartScheme],
      },
      {
        label: t("chart.assembly.absence"),
        data: grades.map((grade) => grade.assembly.absence * -1),
        backgroundColor: { light: "#B3261E", dark: "#FFBAB1" }[chartScheme],
      },
      {
        label: t("chart.homeroom.absence"),
        data: grades.map((grade) => grade.homeroom.absence * -1),
        backgroundColor: { light: "#B3261E88", dark: "#FFBAB188" }[chartScheme],
      },
    ],
  };

  return (
    <Bar options={options} data={data} style={style} className={className} />
  );
};

export default GradesBreakdownChart;
