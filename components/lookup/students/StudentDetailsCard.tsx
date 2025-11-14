import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import PersonContactGrid from "@/components/lookup/people/PersonContactGrid";
import PersonHeader from "@/components/lookup/people/PersonHeader";
import PersonInformationGrid from "@/components/lookup/people/PersonInformationGrid";
import PersonScheduleCard from "@/components/lookup/people/PersonScheduleCard";
import CurrentLearningPeriodCard from "@/components/lookup/students/CurrentLearningPeriodCard";
import StudentAttendanceSummary from "@/components/lookup/students/StudentAttendanceSummary";
import StudentCertificateGrid from "@/components/lookup/students/StudentCertificateGrid";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/component";
import { Student, UserRole } from "@/utils/types/person";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import StudentMedicalConditionsGrid from "./StudentMedicalConditionsGrid";

/**
 * A Card that contains the details of a Student in Search Students.
 *
 * @param student The Student to show the details of.
 *
 * @param options Options to customize the Card.
 * @param options.hideSeeClass Whether to hide the See class Chip.
 * @param options.hideScheduleCard Whether to hide the Student Schedule Card.
 */
const StudentDetailsCard: StylableFC<{
  student: Student | null;
  options?: Partial<{
    hideSeeClass: boolean;
    hideScheduleCard: boolean;
  }>;
}> = ({ student, options, style, className }) => {
  const mysk = useMySKClient();
  const canSeeSensitive =
    mysk.user?.is_admin ||
    mysk.user?.role !== UserRole.student ||
    mysk.person?.id === student?.id || // Self
    false;

  const positionTransition = transition(DURATION.medium2, EASING.standard);

  const [scheduleOpen, toggleScheduleOpen] = useToggle();

  const certificates =
    student?.certificates.filter(
      ({ year }) => year === getCurrentAcademicYear(),
    ) || [];

  return (
    <LookupDetailsCard style={style} className={className}>
      <LayoutGroup>
        <AnimatePresence>
          {student && (
            <>
              <PersonHeader
                person={student}
                onScheduleOpenClick={toggleScheduleOpen}
                options={options}
              />
              <LookupDetailsContent>
                {!options?.hideScheduleCard && student.classroom && (
                  <div className="grid gap-2">
                    <CurrentLearningPeriodCard
                      classroomID={student.classroom.id}
                      onClick={toggleScheduleOpen}
                    />
                    <PersonScheduleCard person={student} open={scheduleOpen} />
                  </div>
                )}

                <motion.div layout="position" transition={positionTransition}>
                  <PersonInformationGrid person={student} />
                </motion.div>
                {canSeeSensitive && (
                  <StudentMedicalConditionsGrid student={student} />
                )}

                {student.contacts.length > 0 && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                  >
                    <PersonContactGrid
                      role={UserRole.student}
                      contacts={student.contacts}
                    />
                  </motion.section>
                )}

                {certificates.length > 0 && (
                  <motion.div layout="position" transition={positionTransition}>
                    <StudentCertificateGrid certificates={certificates} />
                  </motion.div>
                )}

                {canSeeSensitive && student.classroom && (
                  <motion.div layout="position" transition={positionTransition}>
                    <StudentAttendanceSummary
                      studentID={student.id}
                      classroom={student.classroom || undefined}
                    />
                  </motion.div>
                )}
              </LookupDetailsContent>
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </LookupDetailsCard>
  );
};

export default StudentDetailsCard;
