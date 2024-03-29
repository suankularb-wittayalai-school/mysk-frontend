import ClassContactList from "@/components/classes/ClassContactList";
import ClassHeader from "@/components/classes/ClassHeader";
import ClassScheduleCard from "@/components/classes/ClassScheduleCard";
import ClassStudentList from "@/components/classes/ClassStudentList";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import InformationCard from "@/components/lookup/people/InformationCard";
import CurrentLearningPeriodCard from "@/components/lookup/students/CurrentLearningPeriodCard";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A Lookup Detail Card that displays details of a Classroom.
 *
 * @param classroom The Classroom to display details for.
 * @param isOwnClass Whether the Classroom belongs to the current user.
 * @param user The currently logged in user. Used for Role and Permissions.
 * @param refreshData Should refresh Classroom data.
 */
const ClassDetailsCard: StylableFC<{
  classroom?: Omit<Classroom, "year" | "subjects">;
  isOwnClass?: boolean;
  user: User;
  refreshData: () => void;
}> = ({ classroom, isOwnClass, user, refreshData, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail" });

  const { duration, easing } = useAnimationConfig();
  const positionTransition = transition(duration.medium2, easing.standard);

  const [scheduleOpen, toggleScheduleOpen] = useToggle();

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
            isOwnClass={isOwnClass}
            user={user}
          />
          <LookupDetailsContent className="!overflow-auto">
            <LayoutGroup>
              {/* Schedule */}
              {(!isOwnClass || user.role !== UserRole.student) && (
                <div className="grid gap-2">
                  <CurrentLearningPeriodCard
                    classroomID={classroom.id}
                    onClick={toggleScheduleOpen}
                  />
                  <ClassScheduleCard
                    classroom={classroom}
                    open={scheduleOpen}
                  />
                </div>
              )}

              <motion.section
                layout="position"
                transition={positionTransition}
                className="grid grid-cols-2 gap-2 md:grid-cols-4"
              >
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
              </motion.section>

              <motion.section
                layout="position"
                transition={positionTransition}
                className={cn(`flex flex-col-reverse gap-x-2 gap-y-5 md:grid
                  md:grid-cols-2`)}
              >
                {/* Students */}
                {classroom.students.length > 0 && (
                  <ClassStudentList
                    students={classroom.students}
                    classNumber={classroom.number}
                    isOwnClass={isOwnClass}
                    user={user}
                    className="max-h-96 !overflow-auto"
                  />
                )}

                {/* Contacts */}
                {((isOwnClass && user.role === UserRole.teacher) ||
                  classroom.contacts.length > 0) && (
                  <ClassContactList
                    contacts={classroom.contacts}
                    classroomID={classroom.id}
                    editable={isOwnClass && user.role === UserRole.teacher}
                    refreshData={refreshData}
                  />
                )}
              </motion.section>
            </LayoutGroup>
          </LookupDetailsContent>
        </>
      )}
    </LookupDetailsCard>
  );
};

export default ClassDetailsCard;
