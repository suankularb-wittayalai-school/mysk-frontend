// Imports
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import { StylableFC } from "@/utils/types/component";
import { Student } from "@/utils/types/person";

/**
 * A Card that contains the details of a Student in Search Students.
 *
 * @param student The Student to show the details of.
 */
const StudentDetailsCard: StylableFC<{
  student?: Student;
}> = ({ student, style, className }) => {
  return (
    <LookupDetailsCard style={style} className={className}>
      {}
    </LookupDetailsCard>
  );
};

export default StudentDetailsCard;
