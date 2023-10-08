// Imports
import ContactCard from "@/components/account/ContactCard";
import MultilangText from "@/components/common/MultilingualText";
import CurrentTeachingPeriodCard from "@/components/lookup/teachers/CurrentTeachingPeriodCard";
import InformationCard from "@/components/lookup/teachers/InformationCard";
import TeacherHeader from "@/components/lookup/teachers/TeacherHeader";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import {
  Columns,
  Progress,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import SubjectInChardCard from "./SubjectInChargeCard";

const TeacherDetailsCard: StylableFC<{
  id?: string;
}> = ({ id, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "teachers.detail" });
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    withLoading(
      async () => {
        if (!id) {
          setTeacher(null);
          return false;
        }

        const { data, error } = await getTeacherByID(supabase, id, {
          detailed: true,
          includeContacts: true,
        });
        if (error) return false;

        setTeacher(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [id]);

  return (
    <div
      style={style}
      className={cn(
        `relative flex h-full flex-col overflow-auto rounded-lg border-1
        border-outline-variant bg-surface-3 md:overflow-hidden`,
        className,
      )}
    >
      <Progress
        appearance="linear"
        alt="Loading teacher…"
        visible={loading}
        className="absolute inset-0 bottom-auto"
      />
      <AnimatePresence>
        {teacher && (
          <>
            <TeacherHeader teacher={teacher} />
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(
                duration.medium2,
                easing.standardDecelerate,
              )}
              className={cn(`flex grow flex-col gap-5
                rounded-[inherit] bg-surface-1 p-4 md:overflow-auto`)}
            >
              <CurrentTeachingPeriodCard teacherID={teacher.id} />

              <Columns columns={4} className="!items-stretch !gap-2">
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
                {teacher.nickname?.th && (
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
              </Columns>

              {teacher.contacts.length > 0 && (
                <section className="space-y-2">
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
                </section>
              )}

              {teacher.subjects_in_charge.length > 0 && (
                <section className="space-y-2">
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
                </section>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDetailsCard;
