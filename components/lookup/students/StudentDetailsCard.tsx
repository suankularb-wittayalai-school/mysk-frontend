// Imports
import MultilangText from "@/components/common/MultilingualText";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import LookupDetailsContent from "@/components/lookup/LookupDetailsContent";
import InformationCard from "@/components/lookup/people/InformationCard";
import PersonContactGrid from "@/components/lookup/people/PersonContactGrid";
import PersonHeader from "@/components/lookup/people/PersonHeader";
import PersonScheduleCard from "@/components/lookup/people/PersonScheduleCard";
import CurrentLearningPeriodCard from "@/components/lookup/students/CurrentLearningPeriodCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/component";
import { Student } from "@/utils/types/person";
import { differenceInYears } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A Card that contains the details of a Student in Search Students.
 *
 * @param student The Student to show the details of.
 */
const StudentDetailsCard: StylableFC<{
  student?: Student;
}> = ({ student, style, className }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "students.detail" });
  const { t: tx } = useTranslation("common");

  const [scheduleOpen, toggleScheduleOpen] = useToggle();

  return (
    <LookupDetailsCard style={style} className={className}>
      <AnimatePresence>
        {student && (
          <>
            <PersonHeader
              person={student}
              onScheduleOpenClick={toggleScheduleOpen}
            />
            <LookupDetailsContent>
              {student.classroom && (
                <div className="grid gap-2">
                  <CurrentLearningPeriodCard
                    classroomID={student.classroom.id}
                    onClick={toggleScheduleOpen}
                  />
                  <PersonScheduleCard person={student} open={scheduleOpen} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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
                  <InformationCard title={t("information.classroom.title")}>
                    {tx("class", { number: student.classroom.number })}
                    <br />
                    {t("information.classroom.classNo", {
                      number: student.class_no,
                    })}
                  </InformationCard>
                )}
                {student.birthdate &&
                  // Assuming no real person is born on Jan 1, 1970
                  student.birthdate !== "1970-01-01" && (
                    <InformationCard title={t("information.birthday.title")}>
                      <time>
                        {t("information.birthday.date", {
                          date: new Date(student.birthdate),
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
              </div>

              {student.contacts.length > 0 && (
                <PersonContactGrid contacts={student.contacts} />
              )}
            </LookupDetailsContent>
          </>
        )}
      </AnimatePresence>
    </LookupDetailsCard>
  );
};

export default StudentDetailsCard;
