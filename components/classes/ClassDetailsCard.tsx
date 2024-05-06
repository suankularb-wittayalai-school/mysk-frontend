import ClassAdvisorGrid from "@/components/classes/ClassAdvisorsGrid";
import ClassContactList from "@/components/classes/ClassContactList";
import ClassHeader from "@/components/classes/ClassHeader";
import ClassScheduleCard from "@/components/classes/ClassScheduleCard";
import ClassStudentList from "@/components/classes/ClassStudentList";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import CurrentLearningPeriodCard from "@/components/lookup/students/CurrentLearningPeriodCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import classroomOfPerson from "@/utils/helpers/classroom/classroomOfPerson";
import useToggle from "@/utils/helpers/useToggle";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";

/**
 * A Lookup Detail Card that displays details of a Classroom.
 *
 * @param classroom The Classroom to display details for.
 * @param refreshData Should refresh Classroom data.
 */
const ClassDetailsCard: StylableFC<{
  classroom?: Omit<Classroom, "year" | "subjects">;
  refreshData: () => void;
}> = ({ classroom, refreshData, style, className }) => {
  const mysk = useMySKClient();

  const positionTransition = transition(DURATION.medium2, EASING.standard);
  const [scheduleOpen, toggleScheduleOpen] = useToggle();

  const isOwnClass =
    (mysk.person && classroomOfPerson(mysk.person)?.id === classroom?.id) ||
    false;
  const canSeeSensitive =
    isOwnClass ||
    (mysk.user &&
      (mysk.user.is_admin || mysk.user.role !== UserRole.student)) ||
    false;

  return (
    <LookupDetailsCard
      style={style}
      className={cn(`sm:overflow-hidden`, className)}
    >
      {classroom && mysk.user && (
        <>
          <ClassHeader classroom={classroom} />
          <LookupDetailsContent className="!overflow-auto">
            <LayoutGroup>
              {/* Schedule */}
              {(!isOwnClass || mysk.user.role !== UserRole.student) && (
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

              {/* Class advisors */}
              <motion.section layout="position" transition={positionTransition}>
                <ClassAdvisorGrid advisors={classroom.class_advisors} />
              </motion.section>

              <motion.section
                className={cn(`flex flex-col-reverse gap-x-2 gap-y-5 md:-mb-4
                  md:grid md:min-h-96 md:grow md:grid-cols-2`)}
              >
                {/* Students */}
                {classroom.students.length > 0 && (
                  <ClassStudentList
                    students={classroom.students}
                    classroom={classroom}
                  />
                )}

                {/* Contacts */}
                {canSeeSensitive && classroom.contacts.length > 0 && (
                  <ClassContactList
                    contacts={classroom.contacts}
                    classroomID={classroom.id}
                    editable={isOwnClass && mysk.user.role === UserRole.teacher}
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
