import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import StudentDetailsCard from "@/components/lookup/students/StudentDetailsCard";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import {
  Avatar,
  ListItem,
  ListItemContent,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { sift } from "radash";
import { useState } from "react";

/**
 * A List Item of Class Student List that displays a Student’s name, number, and
 * profile picture.
 *
 * @param student A Student from the Classroom, which only includes their name, number, and profile picture.
 */
const ClassStudentListItem: StylableFC<{
  student: Pick<
    Student,
    | "id"
    | "first_name"
    | "middle_name"
    | "last_name"
    | "nickname"
    | "profile"
    | "class_no"
  >;
}> = ({ student, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail.students" });

  const [detailsOpen, setDetailsOpen] = useState(false);

  const supabase = useSupabaseClient();
  const [studentDetails, setStudentDetails] = useState<Student>();

  return (
    <>
      <ListItem
        key={student.id}
        align="center"
        lines={2}
        onClick={async () => {
          setDetailsOpen(true);
          setStudentDetails(undefined);
          const { data } = await getStudentByID(supabase, student.id);
          if (data) setStudentDetails(data);
        }}
        style={style}
        className={className}
      >
        {/* Profile */}
        <Avatar>
          {student.profile && <Image src={student.profile} alt="" />}
        </Avatar>
        <ListItemContent
          // Full name
          title={getLocaleName(locale, student)}
          desc={sift([
            // Class no.
            t("item.classNo", { classNo: student.class_no }),
            // Nickname
            (student.nickname?.th || student.nickname?.["en-US"]) &&
              `${getLocaleString(student.nickname, locale)}`,
          ]).join(" • ")}
        />
      </ListItem>

      {/* Details */}
      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <StudentDetailsCard
          student={studentDetails}
          options={{ hideSeeClass: true, hideScheduleCard: true }}
        />
      </LookupDetailsDialog>
    </>
  );
};

export default ClassStudentListItem;
