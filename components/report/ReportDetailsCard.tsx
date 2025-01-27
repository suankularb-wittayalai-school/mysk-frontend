import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import ReportInputForm from "@/components/report/ReportInputForm";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { Header } from "@suankularb-components/react";
import { Report } from "@/utils/types/report";

const ReportDetailsCard: StylableFC<{
  teacher: Teacher;
  report: Report[];
}> = ({ teacher, report, style, className }) => {
  console.log(report, "hello");
  return (
    <LookupDetailsCard>
      <div className="flex flex-col gap-6 p-4">
        <Header>{"Add Teaching Report"}</Header>
      </div>
      <LookupDetailsContent>
        <ReportingTeacherInformationGrid teacher={teacher} />
        <ReportInputForm teacher={teacher} report={report} />
      </LookupDetailsContent>
    </LookupDetailsCard>
  );
};

export default ReportDetailsCard;
