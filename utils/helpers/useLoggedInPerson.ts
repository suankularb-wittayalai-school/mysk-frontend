// Imports
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import logError from "@/utils/helpers/logError";
import useUser from "@/utils/helpers/useUser";
import { Student, Teacher } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import useMySKClient from "../backend/mysk/useMySKClient";

export default function useLoggedInPerson(options?: {
  includeContacts: boolean;
  detailed?: boolean;
}) {
  const { user, status } = useUser();
  const [person, setPerson] = useState<Student | Teacher | null>(null);
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  useEffect(() => {
    if (!user) return;
    (async () => {
      switch (user!.role) {
        case "student":
          const { data, error } = await getStudentFromUserID(
            supabase,
            mysk,
            user!.id,
            options,
          );
          if (error) {
            logError("useLoggedInPerson (student)", error);
          }
          setPerson({ ...data!, is_admin: user!.is_admin });
          break;

        case "teacher":
          const { data: teacherData, error: teacherError } =
            await getTeacherFromUserID(supabase, mysk, user!.id, options);
          if (teacherError) {
            logError("useLoggedInPerson (teacher)", teacherError);
          }
          setPerson({ ...teacherData!, is_admin: user!.is_admin });
          break;
      }
    })();
  }, [user]);

  return { person, status };
}
