// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

// Types
import { Teacher } from "@utils/types/person";
import Link from "next/link";

interface TeacherCardProps {
  teacher: Teacher;
  hasAction?: boolean;
  className?: string;
}

const TeacherCard = ({ teacher, hasAction, className }: TeacherCardProps) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <Link href={`/teacher/${teacher.id}`}>
      <a className={className}>
        <Card type="horizontal" hasAction={hasAction}>
          {/* FIXME: When Card Media is added to React SK Components, change this */}
          <div className="card__media container-tertiary m-[2px]">
            <div className="relative h-full w-full">
              <Image
                src={
                  teacher.profile
                    ? teacher.profile
                    : "/images/common/avatar.svg"
                }
                layout="fill"
                alt=""
              />
            </div>
          </div>
          <CardHeader
            title={
              <h4 className="font-display text-lg font-medium break-all">
                {teacher.name[locale].firstName}{" "}
                {teacher.name[locale].middleName}{" "}
                {teacher.name[locale].lastName}
              </h4>
            }
            label={
              <div className="!flex flex-row items-center divide-x divide-outline">
                <div className="flex w-fit flex-row gap-1 pr-1">
                  <MaterialIcon icon="mail" className="text-primary" />
                </div>
                <span className="pl-1">ชีววิทยา</span>
              </div>
            }
          />
        </Card>
      </a>
    </Link>
  );
};

export default TeacherCard;
