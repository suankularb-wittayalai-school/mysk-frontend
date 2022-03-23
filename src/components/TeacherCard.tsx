// Modules
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
}

const TeacherCard = ({
  teacher,
  hasSubjectSubgroup,
  hasArrow,
  appearance,
  hasAction,
}: TeacherCardProps) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["teachers", "common"]);

  const teacherName = nameJoiner(locale, teacher.name);

  return (
    <Card
      type="horizontal"
      appearance={appearance || "outlined"}
      hasAction={hasAction}
    >
      {/* FIXME: When Card Media is added to React SK Components, change this */}
      <div
        className={`card__media container-tertiary ${
          appearance == "outlined" ? "m-[2px]" : ""
        }`}
      >
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
              <div className="flex w-fit flex-row gap-1 pr-1">
                <MaterialIcon icon="mail" className="text-primary" />
              </div>
              <span className="pl-1">
                {teacher.subjectsInCharge.length == 0
                  ? t("noSubjectGroup")
                  : teacher.subjectsInCharge[0].subjectSubgroup.name[locale]}
              </span>
            </div>
          ) : (
            <div className="flex w-fit flex-row gap-1 pr-1">
              <MaterialIcon icon="mail" className="text-primary" />
            </div>
          )
        }
        end={
          hasArrow ? (
            <div>
              <LinkButton
                label={t("see-details", { ns: "common" })}
                type="tonal"
                icon={<MaterialIcon icon="arrow_forward" />}
                iconOnly
                url={`/teacher/${teacher.id}`}
              />
            </div>
          ) : undefined
        }
      />
    </Card>
  );
};

export default TeacherCard;
