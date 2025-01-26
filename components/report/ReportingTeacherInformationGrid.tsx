import MultilangText from "@/components/common/MultilingualText";
import AgeCircle from "@/components/lookup/people/AgeCircle";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { sift } from "radash";

/**
 * A grid of information about a Student or Teacher, like their full name,
 * nickname, Classroom, and birthday.
 *
 * @param person The Student or Teacher to show the information of.
 */
const ReportingTeacherInformationGrid: StylableFC<{
  teacher: Teacher;
}> = ({ teacher, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("search/teachers/detail");

  return (
    <section
      style={style}
      className={cn(`grid grid-cols-2 gap-2 md:grid-cols-4`, className)}
    >
      {/* Full name */}
      <Card appearance="filled" className="col-span-2">
        <CardHeader title={t("information.fullName")} />
        <CardContent>
          <MultilangText
            text={{
              th: getLocaleName("th", teacher, { prefix: true }),
              "en-US": getLocaleName("en-US", teacher, { prefix: true }),
            }}
            options={{
              combineIfAllIdentical: true,
              hideIconsIfOnlyLanguage: true,
            }}
          />
        </CardContent>
      </Card>

      {/* Nickname */}
      {teacher.nickname && sift(Object.values(teacher.nickname)).length > 0 && (
        <Card appearance="filled">
          <CardHeader title={t("information.nickname")} />
          <CardContent>
            <MultilangText
              text={teacher.nickname}
              options={{
                combineIfAllIdentical: true,
                hideIconsIfOnlyLanguage: true,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Subject group */}
      {teacher.subject_group && (
        <Card appearance="filled">
          <CardHeader title={t("information.subjectGroup")} />
          <CardContent>
            {getLocaleString(teacher.subject_group.name, locale)}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default ReportingTeacherInformationGrid;
