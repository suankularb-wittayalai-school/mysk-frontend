import BrandIcon from "@/components/icons/BrandIcon";
import PeopleChipSet from "@/components/person/PeopleChipSet";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
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

  const { duration, easing } = useAnimationConfig();

  return (
    <Card
      appearance="filled"
      element={(props) => (
        <motion.li
          {...props}
          layoutId={`subject-${subject.id}`}
          transition={transition(duration.medium4, easing.standard)}
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
            // Use the Google Classroom link if it exists, otherwise copy the
            // Google Classroom code to the clipboard.
            {...(subject.ggc_link
              ? {
                  href: subject.ggc_link,
                  // eslint-disable-next-line react/display-name
                  element: forwardRef((props, ref) => (
                    <a ref={ref} {...props} />
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
        <PeopleChipSet
          scrollable
          people={subject.teachers.map((teacher) => ({
            role: UserRole.teacher,
            ...teacher,
          }))}
          className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
        />
      </CardContent>
    </Card>
  );
};

export default ClassroomSubjectCard;
