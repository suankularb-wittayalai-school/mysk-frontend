import PersonAvatar from "@/components/common/PersonAvatar";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student, User, UserRole } from "@/utils/types/person";
import { ListItem, ListItemContent } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { useState } from "react";

/**
 * A List Item of Class Student List that displays a Student’s name, number, and
 * profile picture.
 *
 * @param student A Student from the Classroom, which only includes their name, number, and profile picture.
 * @param isOwnClass Whether the Classroom belongs to the current user.
 * @param user The currently logged in user. Used for permissions.
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
  isOwnClass?: boolean;
  user: User;
}> = ({ student, isOwnClass, user, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail.students" });

  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <WithPersonDetails
      open={detailsOpen}
      person={{ ...student, role: UserRole.student }}
      user={user}
      onClose={() => setDetailsOpen(false)}
      options={{ isOwnClass, hideSeeClass: true, hideScheduleCard: true }}
    >
      <ListItem
        key={student.id}
        align="center"
        lines={2}
        onClick={() => setDetailsOpen(true)}
        style={style}
        className={className}
      >
        {/* Profile */}
        <PersonAvatar {...student} />
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
    </WithPersonDetails>
  );
};

export default ClassStudentListItem;
