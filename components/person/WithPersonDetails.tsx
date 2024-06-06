import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import StudentDetailsCard from "@/components/lookup/students/StudentDetailsCard";
import TeacherDetailsCard from "@/components/lookup/teachers/TeacherDetailsCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher, User, UserRole } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ComponentProps, ReactNode, useEffect, useState } from "react";

/**
 * A component that wraps another component with a Student/Teacher Details
 * Dialog. Also handles fetching the details of the Student/Teacher, so that’s
 * nice.
 *
 * @param children The component to wrap.
 * @param open Whether the Dialog is open and shown.
 * @param person The Student or Teacher to display the details of.
 * @param onClose Triggers when the Dialog is closed.
 * @param options Options to customize the Details Card.
 */
const WithPersonDetails: StylableFC<{
  children: ReactNode;
  open?: boolean;
  person: Pick<Student | Teacher, "id" | "role">;
  onClose: () => void;
  options?: ComponentProps<
    typeof StudentDetailsCard | typeof TeacherDetailsCard
  >["options"];
}> = ({ children, open, person, onClose, options, style, className }) => {
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const [personDetails, setPersonDetails] = useState<Student | Teacher | null>(
    null,
  );

  useEffect(() => {
    if (!open || person.id === personDetails?.id) return;
    (async () => {
      setPersonDetails(null);
      const { data, error } = await {
        student: getStudentByID,
        teacher: getTeacherByID,
      }[person.role](supabase, mysk, person.id, {
        detailed: true,
        includeContacts: true,
        includeCertificates: true,
      });
      if (error) return;
      setPersonDetails(data);
    })();
  }, [open, person]);

  return (
    <>
      {children}
      <LookupDetailsDialog
        open={open}
        onClose={onClose}
        style={style}
        className={className}
      >
        {person.role === UserRole.student ? (
          <StudentDetailsCard
            student={personDetails as Student}
            options={options}
          />
        ) : (
          <TeacherDetailsCard
            teacher={personDetails as Teacher}
            options={options}
          />
        )}
      </LookupDetailsDialog>
    </>
  );
};

export default WithPersonDetails;
