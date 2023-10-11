// Imports
import ContactCard from "@/components/account/ContactCard";
import MultilangText from "@/components/common/MultilingualText";
import CurrentTeachingPeriodCard from "@/components/lookup/teachers/CurrentTeachingPeriodCard";
import InformationCard from "@/components/lookup/teachers/InformationCard";
import SubjectInChardCard from "@/components/lookup/teachers/SubjectInChargeCard";
import TeacherHeader from "@/components/lookup/teachers/TeacherHeader";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import {
  Columns,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import PersonScheduleCard from "../person/PersonScheduleCard";
import StarbucksCard from "./StarbucksCard";

const TeacherDetailsCard: StylableFC<{
  teacher?: Teacher;
}> = ({ teacher, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers.detail" });
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const [scheduleOpen, toggleScheduleOpen] = useToggle();

  return (
    <div
      style={style}
      className={cn(
        `relative flex h-full flex-col overflow-hidden rounded-lg border-1
        border-outline-variant bg-surface-3 sm:overflow-auto md:overflow-hidden`,
        className,
      )}
    >
      <AnimatePresence>
        {teacher && (
          <>
            <TeacherHeader
              teacher={teacher}
              onScheduleOpenClick={toggleScheduleOpen}
            />
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(
                duration.medium2,
                easing.standardDecelerate,
              )}
              className={cn(`flex grow flex-col gap-5 overflow-auto
                rounded-t-lg bg-surface-1 p-4 sm:overflow-visible
                md:overflow-auto`)}
            >
              <div className="grid gap-2">
                <CurrentTeachingPeriodCard
                  teacherID={teacher.id}
                  onClick={toggleScheduleOpen}
                />
                <PersonScheduleCard person={teacher} open={scheduleOpen} />
              </div>

              {teacher.first_name["en-US"] === "Supannee" && <StarbucksCard />}

              <motion.div
                layout="position"
                transition={transition(duration.medium2, easing.standard)}
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
              </motion.div>

              {teacher.contacts.length > 0 && (
                <motion.section
                  layout="position"
                  transition={transition(duration.medium2, easing.standard)}
                  className="space-y-2"
                >
                  <Text
                    type="title-medium"
                    element="h3"
                    className="rounded-md bg-surface px-3 py-2"
                  >
                    {t("contacts.title")}
                  </Text>
                  <Columns columns={2} className="!gap-2">
                    {teacher.contacts.map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        className={cn(`!border-0 hover:m-[-1px] hover:!border-1
                          focus:m-[-1px] focus:!border-1`)}
                      />
                    ))}
                  </Columns>
                </motion.section>
              )}

              {teacher.subjects_in_charge.length > 0 && (
                <motion.section
                  layout="position"
                  transition={transition(duration.medium2, easing.standard)}
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
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDetailsCard;
