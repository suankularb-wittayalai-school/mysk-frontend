// Imports
import ClassContactList from "@/components/classes/ClassContactList";
import ClassHeader from "@/components/classes/ClassHeader";
import ClassStudentList from "@/components/classes/ClassStudentList";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import InformationCard from "@/components/lookup/teachers/InformationCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { useTranslation } from "next-i18next";

/**
 * A Lookup Detail Card that displays details of a Classroom.
 *
 * @param classroom The Classroom to display details for.
 * @param teacherID The ID of the Teacher currently logged in, if the user is a Teacher. Used for Attendance.
 * @param isOwnClass Whether the Classroom belongs to the current user.
 * @param role The role of the current user.
 */
const ClassDetailsCard: StylableFC<{
  classroom?: Omit<Classroom, "year" | "subjects">;
  teacherID?: string;
  isOwnClass?: boolean;
  role: UserRole;
  refreshData: () => void;
}> = ({
  classroom,
  teacherID,
  isOwnClass,
  role,
  refreshData,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail" });

  return (
    <LookupDetailsCard
      style={style}
      className={cn(
        `sm:overflow-visible [&>section]:md:overflow-visible`,
        className,
      )}
    >
      {classroom && (
        <>
          <ClassHeader
            classroom={classroom}
            teacherID={teacherID}
            isOwnClass={isOwnClass}
            role={role}
          />
          <LookupDetailsContent>
            <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {/* Class advisors */}
              <InformationCard
                title={t("general.classAdvisors")}
                className="col-span-2"
              >
                <ul className="list-disc pb-1 pl-6">
                  {classroom.class_advisors.map((advisor) => (
                    <li key={advisor.id}>
                      {getLocaleName(locale, advisor, { prefix: "teacher" })}
                    </li>
                  ))}
                </ul>
              </InformationCard>

              {/* Room */}
              <InformationCard title={t("general.room")}>
                {classroom.main_room}
              </InformationCard>
            </section>

            <section className="-mb-4 flex flex-col-reverse gap-x-2 gap-y-5 md:grid md:grow md:grid-cols-2">
              {/* Students */}
              {classroom.students.length > 0 && (
                <ClassStudentList
                  students={classroom.students}
                  classNumber={classroom.number}
                />
              )}

              {/* Contacts */}
              {((teacherID && isOwnClass) || classroom.contacts.length > 0) && (
                <ClassContactList
                  contacts={classroom.contacts}
                  classroomID={classroom.id}
                  editable={teacherID !== null && isOwnClass}
                  refreshData={refreshData}
                />
              )}
            </section>
          </LookupDetailsContent>
        </>
      )}
    </LookupDetailsCard>
  );
};

export default ClassDetailsCard;
