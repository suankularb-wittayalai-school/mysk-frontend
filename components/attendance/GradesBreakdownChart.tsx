import {
  AttendanceEvent,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useTranslation } from "next-i18next";
import { list } from "radash";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const GradesBreakdownChart: StylableFC<{
  grades: { [key in AttendanceEvent]: ManagementAttendanceSummary }[];
}> = ({ grades, style, className }) => {
  const {t} = useTranslation("manage", { keyPrefix: "attendance.chart" });
  const { t: tx } = useTranslation("common");

  const options = {
    indexAxis: "y" as const,
    responsive: true,
  };

  const labels = list(1, 6).map((grade) => tx("class", { number: grade }));

  const data = {
    labels,
    datasets: [
      {
        label: t("assembly.late"),
        data: grades.map((grade) => grade.assembly.late * -1),
        backgroundColor: "#FEB0D2",
      },
      {
        label: t("assembly.presence"),
        data: grades.map((grade) => grade.assembly.presence),
        backgroundColor: "#236488",
      },
      {
        label: t("homeroom.presence"),
        data: grades.map((grade) => grade.homeroom.presence),
        backgroundColor: "#23648888",
      },
      {
        label: t("assembly.absence"),
        data: grades.map((grade) => grade.assembly.absence * -1),
        backgroundColor: "#B3261E",
      },
      {
        label: t("homeroom.absence"),
        data: grades.map((grade) => grade.homeroom.absence * -1),
        backgroundColor: "#B3261E88",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default GradesBreakdownChart;
