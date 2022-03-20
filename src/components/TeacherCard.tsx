// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { Teacher } from "@utils/types/person";
import { useTranslation } from "next-i18next";
import ProfilePicture from "./ProfilePicture";

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
  const { t } = useTranslation("teachers");

  // (@SiravitPhokeed) I love how hilariously overengineered this is
  const teacherName = [
    teacher.name[locale].firstName,
    teacher.name[locale].middleName,
    teacher.name[locale].lastName,
  ]
    .filter((namePart) => namePart)
    .join(" ");

  return (
    <Card
      type="horizontal"
      appearance={appearance || "outlined"}
      hasAction={hasAction}
    >
      {/* FIXME: When Card Media is added to React SK Components, change this */}
      <div className="card__media container-tertiary m-[2px]">
        {/* <div className="relative h-full w-full">
          <Image
            src={
              teacher.profile ? teacher.profile : "/images/common/avatar.svg"
            }
            layout="fill"
            alt=""
          />
        </div> */}
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
              <Button
                type="tonal"
                icon={<MaterialIcon icon="arrow_forward" />}
                iconOnly
                // url={`/teacher/${teacher.id}`}
              />
            </div>
          ) : undefined
        }
      />
    </Card>
  );
};

export default TeacherCard;
