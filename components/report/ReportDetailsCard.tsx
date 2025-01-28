import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import ReportingTeacherInformationGrid from "@/components/report/ReportingTeacherInformationGrid";
import ReportInputForm from "@/components/report/ReportInputForm";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { Report } from "@/utils/types/report";
import { Header } from "@suankularb-components/react";

const ReportDetailsCard: StylableFC<{
  teacher: Teacher;
  report: Report[];
}> = ({ teacher, report }) => {
  return (
    <LookupDetailsCard>
      <div className="flex flex-col gap-6 p-4">
        <Header>{"รายงานการสอน"}</Header>
      </div>
      <LookupDetailsContent>
        <ReportingTeacherInformationGrid teacher={teacher} />
        <ReportInputForm teacher={teacher} report={report} />
      </LookupDetailsContent>
    </LookupDetailsCard>
  );
};

export default ReportDetailsCard;
