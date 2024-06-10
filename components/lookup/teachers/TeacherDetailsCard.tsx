import LookupDetailsContent from "@/components/lookup//LookupDetailsContent";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import PersonContactGrid from "@/components/lookup/people/PersonContactGrid";
import PersonHeader from "@/components/lookup/people/PersonHeader";
import PersonInformationGrid from "@/components/lookup/people/PersonInformationGrid";
import PersonScheduleCard from "@/components/lookup/people/PersonScheduleCard";
import CurrentTeachingPeriodCard from "@/components/lookup/teachers/CurrentTeachingPeriodCard";
import StarbucksCard from "@/components/lookup/teachers/StarbucksCard";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/common";
import { Teacher, UserRole } from "@/utils/types/person";
import {
  Card,
  CardContent,
  CardHeader,
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

/**
 * A Card that contains the details of a Teacher in Lookup Teachers.
 *
 * @param teacher The Teacher to show the details of.
 */
const TeacherDetailsCard: StylableFC<{
  teacher: Teacher | null;
  options?: Partial<{ hideSeeClass: boolean }>;
}> = ({ teacher, options, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("search/teachers/detail");

  const positionTransition = transition(DURATION.medium2, EASING.standard);

  const [scheduleOpen, toggleScheduleOpen] = useToggle();

  return (
    <LookupDetailsCard style={style} className={className}>
      <LayoutGroup>
        <AnimatePresence>
          {teacher && (
            <>
              {/* Header */}
              <PersonHeader
                person={teacher}
                onScheduleOpenClick={toggleScheduleOpen}
                options={options}
              />

              <LookupDetailsContent>
                {/* Schedule */}
                <div className="grid gap-2">
                  <CurrentTeachingPeriodCard
                    teacherID={teacher.id}
                    onClick={toggleScheduleOpen}
                  />
                  <PersonScheduleCard person={teacher} open={scheduleOpen} />
                </div>

                {/* Starbucks easter egg */}
                {teacher.first_name["en-US"] === "Supannee" && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                  >
                    <StarbucksCard />
                  </motion.section>
                )}

                {/* Details */}
                <motion.div layout="position" transition={positionTransition}>
                  <PersonInformationGrid person={teacher} />
                </motion.div>

                {/* Contacts */}
                {teacher.contacts.length > 0 && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                  >
                    <PersonContactGrid
                      role={UserRole.teacher}
                      contacts={teacher.contacts}
                    />
                  </motion.section>
                )}

                {/* Subjects */}
                {teacher.subjects_in_charge.length > 0 && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                    className="space-y-2"
                  >
                    <Text type="title-medium" element="h3" className="px-3">
                      {t("subjects.title")}
                    </Text>
                    <div className="-mx-4 overflow-auto">
                      <ul className="flex w-fit flex-row gap-2 px-4">
                        {teacher.subjects_in_charge.map((subject) => (
                          <Card
                            key={subject.id}
                            appearance="filled"
                            element="li"
                            className="min-w-[10rem] max-w-[15rem]"
                          >
                            <CardHeader
                              title={getLocaleString(subject.name, locale)}
                              className="*:w-full [&_h3]:truncate"
                            />
                            <CardContent>
                              {getLocaleString(subject.code, locale)}
                            </CardContent>
                          </Card>
                        ))}
                      </ul>
                    </div>
                  </motion.section>
                )}
              </LookupDetailsContent>
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </LookupDetailsCard>
  );
};

export default TeacherDetailsCard;
