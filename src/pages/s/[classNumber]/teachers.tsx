// Modules
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// External Libraries
import { useEffect, useState } from "react";

// SK Components
import {
  Card,
  CardHeader,
  CardList,
  ListLayout,
  ListSection,
  MainSection,
  MaterialIcon,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ContactChip from "@components/ContactChip";
import ProfilePicture from "@components/ProfilePicture";
import TeacherCard from "@components/TeacherCard";

// Backend
import { getTeacherList } from "@utils/backend/person/teacher";
import { getClassIDFromNumber } from "@utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { protectPageFor } from "@utils/helpers/route";
import { createTitleStr } from "@utils/helpers/title";
import { SubjectGroup } from "@utils/types/subject";

// Types
import { TeachersListGroup } from "@utils/types/teachers";
import { Teacher } from "@utils/types/person";

// Page
const Teachers: NextPage<{ teacherList: TeachersListGroup[] }> = ({
  teacherList,
}): JSX.Element => {
  const { t } = useTranslation(["teacher", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  // const teacherList: TeachersListGroup[] = [];

  const [mainContent, setMainContent] = useState<Teacher | null>(null);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (teacherList.length > 0) {
      setMainContent(teacherList[0].content[0].content);
    }
  }, [teacherList]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <ListLayout
        show={true}
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo={showMain ? () => setShowMain(false) : "/account/login"}
            LinkElement={Link}
          />
        }
      >
        <ListSection>
          <CardList
            listGroups={teacherList}
            ListItem={({ content, className, onClick, id }) => {
              return (
                <button
                  onClick={() => {
                    onClick();
                    setShowMain(true);
                    setMainContent(content);
                  }}
                  className="!w-full"
                >
                  <TeacherCard
                    key={content.id}
                    teacher={content}
                    hasSubjectSubgroup
                    className={className}
                    appearance="tonal"
                  />
                </button>
              );
            }}
            onChange={() => {}}
          />
        </ListSection>
        <MainSection>
          <Section className="!flex !flex-col !gap-4 !font-display">
            <Section>
              <div className="grid grid-cols-[1fr_3fr] items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_5fr]">
                <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                  <ProfilePicture src={mainContent?.profile} />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-4xl font-bold">
                      {mainContent ? nameJoiner(locale, mainContent.name) : ""}
                    </h2>
                    <p className="text-2xl font-medium">
                      {mainContent?.subjectGroup.name[locale]}
                    </p>
                  </div>
                  <div>
                    {mainContent?.classAdvisorAt && (
                      <p className="text-2xl font-medium">
                        {t("advisor", {
                          className: mainContent.classAdvisorAt.number,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Section>
            {mainContent?.contacts && mainContent.contacts.length > 0 && (
              <Section>
                <h3 className="text-3xl font-bold">{t("contacts")}</h3>
                <ul className="layout-grid-cols-2">
                  {mainContent.contacts
                    .sort((a, b) =>
                      a.type < b.type ? -1 : a.type > b.type ? 1 : 0
                    )
                    .map((contact) => (
                      <ContactChip
                        key={contact.id}
                        contact={contact}
                        className="!w-initial"
                      />
                    ))}
                </ul>
              </Section>
            )}
            {mainContent?.subjectsInCharge &&
              mainContent.subjectsInCharge.length > 1 && (
                <Section>
                  <h3 className="text-3xl font-bold">{t("subjects")}</h3>
                  <ul className="flex flex-col gap-2">
                    {mainContent.subjectsInCharge.map((subject) => (
                      <li key={subject.id}>
                        <Card
                          type="horizontal"
                          appearance="tonal"
                          className="bg-surface-2"
                        >
                          <CardHeader
                            icon={
                              <MaterialIcon
                                icon={
                                  subject.code.th[0] === "ว"
                                    ? "biotech"
                                    : subject.code.th[0] === "ค"
                                    ? "calculate"
                                    : "circle"
                                }
                              />
                            }
                            title={
                              <div className="!flex gap-4">
                                <span>{subject.code[locale]}</span>
                                <span className="font-medium">
                                  {
                                    (subject.name[locale] || subject.name.th)
                                      .name
                                  }
                                </span>
                              </div>
                            }
                          />
                        </Card>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
          </Section>
        </MainSection>
      </ListLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const redirect = await protectPageFor("admin", req);
  if (redirect) return redirect;
  params,
}) => {
  const teachers = await getTeacherList(
    await getClassIDFromNumber(Number(params?.classNumber))
  );

  const subjectGroups: string[] = teachers
    .map((teacher) =>
      locale
        ? teacher.subjectGroup.name[locale as keyof SubjectGroup["name"]]
        : teacher.subjectGroup.name.th
    )
    .filter((value, index, self) => self.indexOf(value) === index);

  const teacherList: TeachersListGroup[] = subjectGroups.map(
    (subjectGroup) => ({
      groupName: subjectGroup,
      content: teachers
        .filter((teacher) =>
          locale
            ? teacher.subjectGroup.name[
                locale as keyof SubjectGroup["name"]
              ] === subjectGroup
            : teacher.subjectGroup.name.th === subjectGroup
        )
        .map((teacher) => ({ content: teacher, id: teacher.id })),
    })
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "teacher",
      ])),
      teacherList,
    },
  };
};

export default Teachers;
