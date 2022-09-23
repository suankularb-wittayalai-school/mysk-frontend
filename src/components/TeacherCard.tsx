// Modules
import { useRouter } from "next/router";

// SK Components
import {
  Card,
  CardHeader,
} from "@suankularb-components/react";

// Components
import ContactIconList from "@components/ContactIconList";
import ProfilePicture from "@components/ProfilePicture";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { nameJoiner } from "@utils/helpers/name";

// Types
import { LangCode } from "@utils/types/common";
import { Teacher } from "@utils/types/person";

const TeacherCard = ({
  teacher,
  hasSubjectGroup,
  appearance,
  hasAction,
  className,
}: {
  teacher: Teacher;
  hasSubjectGroup?: boolean;
  appearance?: "outlined" | "tonal";
  hasAction?: boolean;
  className?: string;
}) => {
  const locale = useRouter().locale as LangCode;
  const teacherName = nameJoiner(locale, teacher.name);

  return (
    <Card
      type="horizontal"
      appearance={appearance || "outlined"}
      hasAction={hasAction}
      className={className}
    >
      {/* FIXME: When Card Media is added to React SK Components, change this */}
      <div className="card__media">
        <ProfilePicture src={teacher.profile} />
      </div>
      <CardHeader
        title={
          <h4
            className="break-all font-display text-lg font-medium"
            title={teacherName}
          >
            {teacherName}
          </h4>
        }
        label={
          hasSubjectGroup ? (
            <div className="!flex flex-row items-center divide-x divide-outline">
              <ContactIconList contacts={teacher.contacts} />
              <span className="max-lines-1 pl-1">
                {getLocaleString(teacher.subjectGroup.name, locale)}
              </span>
            </div>
          ) : (
            <ContactIconList contacts={teacher.contacts} />
          )
        }
      />
    </Card>
  );
};

export default TeacherCard;
