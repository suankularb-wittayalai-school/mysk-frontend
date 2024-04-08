import MultilangText from "@/components/common/MultilingualText";
import LookupDetailsContent from "@/components/lookup//LookupDetailsContent";
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import InformationCard from "@/components/lookup/people/InformationCard";
import PersonContactGrid from "@/components/lookup/people/PersonContactGrid";
import PersonHeader from "@/components/lookup/people/PersonHeader";
import PersonScheduleCard from "@/components/lookup/people/PersonScheduleCard";
import CurrentTeachingPeriodCard from "@/components/lookup/teachers/CurrentTeachingPeriodCard";
import StarbucksCard from "@/components/lookup/teachers/StarbucksCard";
import SubjectInChardCard from "@/components/lookup/teachers/SubjectInChargeCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import {
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A Card that contains the details of a Teacher in Lookup Teachers.
 *
 * @param teacher The Teacher to show the details of.
 */
const TeacherDetailsCard: StylableFC<{
  teacher?: Teacher;
  options?: Partial<{ hideSeeClass: boolean }>;
}> = ({ teacher, options, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers.detail" });
  const { t: tx } = useTranslation("common");

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
                        th: getLocaleName("th", teacher, { prefix: true }),
                        "en-US": getLocaleName("en-US", teacher, {
                          prefix: true,
                        }),
                      }}
                      options={{
                        combineIfAllIdentical: true,
                        hideIconsIfOnlyLanguage: true,
                      }}
                    />
                  </InformationCard>
                  {teacher.nickname &&
                    sift(Object.values(teacher.nickname)).length > 0 && (
                      <InformationCard title={t("information.nickname")}>
                        <MultilangText
                          text={teacher.nickname}
                          options={{
                            combineIfAllIdentical: true,
                            hideIconsIfOnlyLanguage: true,
                          }}
                        />
                      </InformationCard>
                    )}
                  <InformationCard
                    title={t("information.subjectGroup")}
                    className="[&>div]:line-clamp-2"
                  >
                    {getLocaleString(teacher.subject_group.name, locale)}
                  </InformationCard>
                  {teacher.class_advisor_at && (
                    <InformationCard title={t("information.classAdvisorAt")}>
                      {tx("class", { number: teacher.class_advisor_at.number })}
                    </InformationCard>
                  )}
                  {teacher.birthdate &&
                    // Assuming no real person is born on Jan 1, 1970
                    teacher.birthdate !== "1970-01-01" && (
                      <InformationCard title={t("information.birthday")}>
                        <time>
                          {new Date(teacher.birthdate).toLocaleDateString(
                            locale,
                            {
                              day: "numeric",
                              month: "long",
                              year: undefined,
                            },
                          )}
                        </time>
                      </InformationCard>
                    )}
                </motion.section>

                {/* Contacts */}
                {teacher.contacts.length > 0 && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                  >
                    <PersonContactGrid contacts={teacher.contacts} />
                  </motion.section>
                )}

                {/* Subjects */}
                {teacher.subjects_in_charge.length > 0 && (
                  <motion.section
                    layout="position"
                    transition={positionTransition}
                    className="space-y-2"
                  >
                    <Text
                      type="title-medium"
                      element="h3"
                      className="rounded-md bg-surface px-3 py-2"
                    >
                      {t("subjects.title")}
                    </Text>
                    <div className="-mx-4 overflow-auto">
                      <ul className="flex w-fit flex-row gap-2 px-4">
                        {teacher.subjects_in_charge.map((subject) => (
                          <SubjectInChardCard
                            key={subject.id}
                            subject={subject}
                          />
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
