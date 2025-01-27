import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import ReportInputForm from "@/components/report/ReportInputForm";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { Header } from "@suankularb-components/react";
import { MySKClient } from "@/utils/types/fetch";
import { SupabaseClient } from "@supabase/supabase-js";

const ReportDetailsCard: StylableFC<{
  teacher: Teacher;
}> = ({ teacher, style, className }) => {
  console.log(teacher.subjects_in_charge[0].name, "where are you");
  return (
    <LookupDetailsCard>
      <div className="flex flex-col gap-6 p-4">
        <Header>{"Add Teaching Report"}</Header>
      </div>
      <LookupDetailsContent>
        <ReportInputForm teacher={teacher} />
      </LookupDetailsContent>
    </LookupDetailsCard>
  );
};

export default ReportDetailsCard;
