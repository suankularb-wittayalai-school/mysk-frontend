import MultilangText from "@/components/common/MultilingualText";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import InformationCard from "@/components/lookup/people/InformationCard";
import PersonContactGrid from "@/components/lookup/people/PersonContactGrid";
import PersonHeader from "@/components/lookup/people/PersonHeader";
import PersonScheduleCard from "@/components/lookup/people/PersonScheduleCard";
import CurrentLearningPeriodCard from "@/components/lookup/students/CurrentLearningPeriodCard";
import StudentAttendanceSummary from "@/components/lookup/students/StudentAttendanceSummary";
import StudentCertificateGrid from "@/components/lookup/students/StudentCertificateGrid";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/component";
import { Student, UserRole } from "@/utils/types/person";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { differenceInYears } from "date-fns";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { sift } from "radash";

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
  const locale = useLocale();
  const { t } = useTranslation("search/students/detail");

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

                <motion.section
                  layout="position"
                  transition={positionTransition}
                  className="grid grid-cols-2 gap-2 md:grid-cols-4"
                >
                  <InformationCard
                    title={t("information.fullName")}
                    className="col-span-2"
                  >
                    <MultilangText
                      text={{
                        th: getLocaleName("th", student, { prefix: true }),
                        "en-US": getLocaleName("en-US", student, {
                          prefix: true,
                        }),
                      }}
                      options={{
                        combineIfAllIdentical: true,
                        hideIconsIfOnlyLanguage: true,
                      }}
                    />
                  </InformationCard>
                  {student.nickname &&
                    sift(Object.values(student.nickname)).length > 0 && (
                      <InformationCard title={t("information.nickname")}>
                        <MultilangText
                          text={student.nickname}
                          options={{
                            combineIfAllIdentical: true,
                            hideIconsIfOnlyLanguage: true,
                          }}
                        />
                      </InformationCard>
                    )}
                  {student.classroom && (
                    <InformationCard title={t("information.classroom")}>
                      {t("common:class", { number: student.classroom.number })}
                      <br />
                      {t("common:classNo", { classNo: student.class_no })}
                    </InformationCard>
                  )}
                  {student.birthdate &&
                    // Assuming no real person is born on Jan 1, 1970
                    student.birthdate !== "1970-01-01" && (
                      <InformationCard title={t("information.birthday.title")}>
                        <time>
                          {new Date(student.birthdate).toLocaleString(locale, {
                            day: "numeric",
                            month: "long",
                          })}
                        </time>
                        <br />
                        {t("information.birthday.age", {
                          count: differenceInYears(
                            new Date(),
                            new Date(student.birthdate),
                          ),
                        })}
                      </InformationCard>
                    )}
                </motion.section>

                {student.contacts.length > 0 && (
                  <motion.div layout="position" transition={positionTransition}>
                    <PersonContactGrid
                      role={UserRole.student}
                      contacts={student.contacts}
                    />
                  </motion.div>
                )}

                {certificates.length > 0 && (
                  <motion.div layout="position" transition={positionTransition}>
                    <StudentCertificateGrid certificates={certificates} />
                  </motion.div>
                )}

                {canSeeSensitive && (
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
