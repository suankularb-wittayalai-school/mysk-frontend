// Imports
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  CategoryScale,
  Chart,
  Colors,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { useTranslation } from "next-i18next";
import { list, sum } from "radash";
import { ComponentProps, useEffect } from "react";
import { Line } from "react-chartjs-2";

Chart.register(
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
);

/**
 * Chart component for Attendance summary of a week.
 * 
 * @param week Attendance summary of a week. Must be up to 5 instances of Management Attendance Summary in an array.
 */
const WeekChart: StylableFC<{
  week: ManagementAttendanceSummary[];
}> = ({ week, style, className }) => {
  const { t } = useTranslation("manage", { keyPrefix: "attendance.chart" });
  const { t: tx } = useTranslation("common");

  // Chart.js options
  const options: ComponentProps<typeof Line>["options"] = {
    responsive: true,
    animation: { duration: 0 },
    plugins: { legend: { position: "bottom" } },
  };

  // Labels for the X axis are the days of the week
  const labels = list(1, 5).map((i) => tx(`datetime.day.${i}`));

  // Stacking data and transforming data to Chart.js format
  const data: ComponentProps<typeof Line>["data"] = {
    labels,
    datasets: [
      {
        label: t("legend.presence"),
        data: week.map((day) => sum(Object.values(day))),
        fill: "+1",
        // Primary
        backgroundColor: "rgba(0, 101, 143, 0.2)",
        borderColor: "rgba(0, 101, 143, 1)",
      },
      {
        label: t("legend.late"),
        data: week.map(({ late, absence }) => late + absence),
        fill: "+1",
        // Secondary
        backgroundColor: "rgba(181, 0, 119, 0.4)",
        borderColor: "rgba(181, 0, 119, 1)",
      },
      {
        label: t("legend.absence"),
        data: week.map(({ absence }) => absence),
        fill: true,
        // Tertiary
        backgroundColor: "rgba(113, 93, 0, 0.2)",
        borderColor: "rgba(113, 93, 0, 1)",
      },
    ],
  };

  // Resize chart on print
  useEffect(() => {
    const resizeChart: Chart["resize"] = (...size) => {
      for (let id in Chart.instances) Chart.instances[id].resize(...size);
    };
    window.addEventListener("beforeprint", () => resizeChart(350, 175));
    window.addEventListener("afterprint", () => resizeChart());
    return () => {
      window.removeEventListener("beforeprint", () => resizeChart(350, 175));
      window.removeEventListener("afterprint", () => resizeChart());
    };
  }, []);

  return (
    <div className={className} style={style}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeekChart;
