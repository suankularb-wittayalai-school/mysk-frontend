// Modules
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardHeader,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import ContactIconList from "@components/ContactIconList";
import ProfilePicture from "@components/ProfilePicture";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { Teacher } from "@utils/types/person";

interface TeacherCardProps {
  teacher: Teacher;
  hasSubjectSubgroup?: boolean;
  hasArrow?: boolean;
  appearance?: "outlined" | "tonal";
  hasAction?: boolean;
  className?: string;
}

const TeacherCard = ({
  teacher,
  hasSubjectSubgroup,
  hasArrow,
  appearance,
  hasAction,
  className,
}: TeacherCardProps) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["teachers", "common"]);

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
          hasSubjectSubgroup ? (
            <div className="!flex flex-row items-center divide-x divide-outline">
              <ContactIconList contacts={teacher.contacts} />
              <span className="max-lines-1 pl-1">
                {teacher.subjectGroup.name[locale]}
              </span>
            </div>
          ) : (
            <ContactIconList contacts={teacher.contacts} />
          )
        }
        end={
          hasArrow ? (
            <div>
              <LinkButton
                name={t("see-details", { ns: "common" })}
                type="tonal"
                icon={<MaterialIcon icon="arrow_forward" />}
                iconOnly
                url={`/teacher/${teacher.id}`}
                LinkElement={Link}
              />
            </div>
          ) : undefined
        }
      />
    </Card>
  );
};

export default TeacherCard;
