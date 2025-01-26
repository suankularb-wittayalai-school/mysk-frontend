import { CustomPage } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import PageHeader from "@/components/common/PageHeader";

const ReportPage: CustomPage<{ teacher: Teacher }> = ({ teacher }) => {
  return <PageHeader parentURL="/teach">{"Teaching Report"}</PageHeader>;
};

export default ReportPage;
