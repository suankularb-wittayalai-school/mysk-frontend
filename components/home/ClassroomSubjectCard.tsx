import BrandIcon from "@/components/icons/BrandIcon";
import PeopleChipSet from "@/components/person/PeopleChipSet";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Actions,
  AssistChip,
  Button,
  Card,
  CardContent,
  CardHeader,
  ChipSet,
  DURATION,
  EASING,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { forwardRef } from "react";

/**
 * A Card that displays a Classroom Subject.
 *
 * @param subject The Classroom Subject to display.
 */
const ClassroomSubjectCard: StylableFC<{
  subject: ClassroomSubject;
}> = ({ subject }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "subjectList.card" });

  const mysk = useMySKClient();

  /** If applicable, ensure the URL is to the right account. */
  const url = subject.ggc_link
    ? mysk.user?.email
      ? `https://accounts.google.com/AccountChooser?${new URLSearchParams({
          continue: subject.ggc_link,
          Email: mysk.user.email,
        })}`
      : subject.ggc_link
    : null;

  return (
    <Card
      appearance="filled"
      element={(props) => (
        <motion.li
          {...props}
          layoutId={`subject-${subject.id}`}
          transition={transition(DURATION.medium4, EASING.standard)}
        />
      )}
    >
      <div className="flex">
        <CardHeader
          title={getLocaleString(subject.subject.name, locale)}
          subtitle={getLocaleString(subject.subject.code, locale)}
          // I have no idea why this works, but it does, and I'm not gonna
          // touch it.
          className="grow truncate break-all [&>*>*]:truncate [&>*]:w-full"
        />
        <Actions className="pr-3">
          <Button
            appearance="text"
            icon={<BrandIcon icon="gg-classroom" />}
            alt={t(`action.${subject.ggc_link ? "ggcLink" : "copyGGCCode"}`)}
            // Use the Google Classroom link if it exists, otherwise copy the
            // Google Classroom code to the clipboard.
            {...(url
              ? {
                  href: url,
                  // eslint-disable-next-line react/display-name
                  element: forwardRef((props, ref) => (
                    <a ref={ref} {...props} target="_blank" />
                  )),
                }
              : {
                  onClick: () => {
                    if (subject.ggc_code)
                      navigator.clipboard.writeText(subject.ggc_code);
                  },
                })}
            // Also show the Google Classroom code as a tooltip if it exists.
            tooltip={subject.ggc_code || undefined}
            disabled={!(subject.ggc_link || subject.ggc_code)}
          />
        </Actions>
      </div>
      <CardContent className="!p-3 !pt-0">
        {subject.teachers.length > 0 ? (
          <PeopleChipSet
            scrollable
            people={subject.teachers.map((teacher) => ({
              ...teacher,
              role: UserRole.teacher,
            }))}
            className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
          />
        ) : (
          <ChipSet>
            <AssistChip disabled className="[&>:last-child]:hidden">
              {t("noTeachers")}
            </AssistChip>
          </ChipSet>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassroomSubjectCard;
