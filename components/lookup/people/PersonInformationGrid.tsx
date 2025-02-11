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
const PersonInformationGrid: StylableFC<{
  person: Student | Teacher;
}> = ({ person, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation(
    {
      student: "search/students/detail",
      teacher: "search/teachers/detail",
    }[person.role],
  );

  const classroom = classroomOfPerson(person);

  const mysk = useMySKClient();

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
              th: getLocaleName("th", person, { prefix: true }),
              "en-US": getLocaleName("en-US", person, { prefix: true }),
            }}
            options={{
              combineIfAllIdentical: true,
              hideIconsIfOnlyLanguage: true,
            }}
          />
        </CardContent>
      </Card>

      {/* Nickname */}
      {person.nickname && sift(Object.values(person.nickname)).length > 0 && (
        <Card appearance="filled">
          <CardHeader title={t("information.nickname")} />
          <CardContent>
            <MultilangText
              text={person.nickname}
              options={{
                combineIfAllIdentical: true,
                hideIconsIfOnlyLanguage: true,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Subject group */}
      {person.role === UserRole.teacher && person.subject_group && (
        <Card appearance="filled">
          <CardHeader title={t("information.subjectGroup")} />
          <CardContent>
            {getLocaleString(person.subject_group.name, locale)}
          </CardContent>
        </Card>
      )}

      {/* Classroom */}
      {classroom && (
        <Card appearance="filled">
          <CardHeader
            title={t(
              {
                student: "information.classroom",
                teacher: "information.classAdvisorAt",
              }[person.role],
            )}
          />
          <CardContent>
            {t("common:class", { number: classroom.number })}
            {person.role === UserRole.student &&
              ` (${t("common:classNo", { classNo: person.class_no })})`}
          </CardContent>
        </Card>
      )}

      {/* Birthday */}
      {person.birthdate &&
        // Hide teachers birthday if the user is a student, except admins.
        (mysk.user?.is_admin || 
          !(mysk.user?.role === UserRole.student && 
            person.role === UserRole.teacher)) && 
        // Assuming no real person is born on Jan 1, 1970.
        person.birthdate !== "1970-01-01" && (
          <Card
            appearance="filled"
            direction="row"
            className="!items-start !border-0"
          >
            <CardHeader
              title={t("information.birthday")}
              subtitle={new Date(person.birthdate).toLocaleString(locale, {
                day: "numeric",
                month: locale === "th" ? "long" : "short",
              })}
              className="grow !py-2"
            />
            <CardContent className="!py-2.5">
              {person.role === UserRole.student && (
                <AgeCircle birthday={new Date(person.birthdate)} />
              )}
            </CardContent>
          </Card>
        )}

      {person.role === UserRole.student &&
        (mysk.user?.is_admin || mysk.user?.role !== UserRole.student) && (
          <Card appearance="filled">
            <CardHeader title={t("information.studentID")} />
            <CardContent>{person.student_id}</CardContent>
          </Card>
        )}
    </section>
  );
};

export default PersonInformationGrid;
