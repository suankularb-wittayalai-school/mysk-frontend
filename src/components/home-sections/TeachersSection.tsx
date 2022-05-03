// Modules
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardHeader,
  Header,
  MaterialIcon,
  Section,
  LinkButton,
} from "@suankularb-components/react";

// Components
import TeacherCard from "@components/TeacherCard";

// Types
import { Teacher } from "@utils/types/person";
import { nameJoiner } from "@utils/helpers/name";

const ClassAdvisorsCard = ({
  classAdvisors,
}: {
  classAdvisors: Array<Teacher>;
}): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Card type="stacked" className="h-fit">
      <CardHeader
        icon={<MaterialIcon icon="group" />}
        title={
          <h3 className="text-lg font-medium">{t("teachers.classAdvisors")}</h3>
        }
        className="font-display"
      />
      <div
        className={`overflow-x-hidden rounded-b-xl ${
          classAdvisors.length > 2
            ? "aspect-[2/1] overflow-y-auto"
            : "overflow-y-hidden"
        }`}
      >
        <div className="grid grid-cols-2 p-[2px]">
          {/* Loop through the array of Class Advisors */}
          {classAdvisors.map((teacher) => (
            <div
              key={teacher.id}
              className="relative aspect-square bg-tertiary-container"
            >
              {/* Photo */}
              {teacher.profile && (
                <Image src={teacher.profile} layout="fill" alt="" />
              )}

              {/* Name bar */}
              <div
                className="absolute bottom-0 flex w-full flex-row items-center justify-between
                  gap-2 bg-[#c1c7cecc] p-2 text-on-surface-variant backdrop-blur-sm dark:bg-[#41484dcc]"
              >
                {/* Name */}
                <h4 className="flex flex-col font-display font-medium leading-none">
                  <span className="max-lines-1 text-lg">
                    {teacher.name[locale]?.firstName ||
                      teacher.name.th.firstName}{" "}
                    {
                      (teacher.name[locale]?.middleName ||
                        teacher.name.th.middleName ||
                        "")[0]
                    }
                  </span>
                  <span className="max-lines-1 text-base">
                    {teacher.name[locale]?.lastName || teacher.name.th.lastName}
                  </span>
                </h4>
                {/* Go to Teacher button */}
                <div>
                  <LinkButton
                    type="tonal"
                    name={t("seeDetails", { ns: "common" })}
                    iconOnly
                    icon={<MaterialIcon icon="arrow_forward" />}
                    url={`/teacher/${teacher.id}`}
                    LinkElement={Link}
                    className="!h-8 !w-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const TeachersSection = ({
  teachers,
  classAdvisors,
}: {
  teachers: Array<Teacher>;
  classAdvisors: Array<Teacher>;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="school" allowCustomSize={true} />}
        text={t("teachers.title")}
      />
      <div className="flex flex-col justify-start gap-3 !px-0 sm:grid sm:grid-cols-2 md:grid-cols-4">
        <div className="px-4 sm:px-0">
          <ClassAdvisorsCard classAdvisors={classAdvisors} />
        </div>
        {teachers.length == 0 ? (
          <div
            className="mx-4 grid place-items-center rounded-xl bg-surface-1 p-8 text-center text-on-surface-variant
              sm:mx-0 md:col-span-3"
          >
            <p>{t("teachers.noTeachers")}</p>
          </div>
        ) : (
          <div
            className="scroll-w-0 scroll-desktop h-full overflow-x-auto
              sm:relative sm:overflow-y-scroll
              md:static md:col-span-3 md:overflow-y-visible"
          >
            <ul
              className="flex h-full w-fit flex-row gap-3 px-4
                sm:absolute sm:top-0 sm:w-full sm:grid-rows-2 sm:flex-col sm:pl-0 sm:pr-2
                md:static md:grid md:grid-cols-9 md:pr-0"
            >
              {teachers.map((teacher, index) => (
                <li
                  key={teacher.id}
                  className={`w-80 sm:w-full md:col-span-3 ${
                    index == 0
                      ? "md:col-start-1"
                      : index == 1
                      ? "md:col-start-5"
                      : index == 2
                      ? "md:col-start-3"
                      : index == 3
                      ? "md:col-start-7"
                      : "md:hidden"
                  }`}
                >
                  <TeacherCard teacher={teacher} hasArrow />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("teachers.action.seeAll")}
          type="filled"
          url="/teachers"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default TeachersSection;
