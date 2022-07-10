// Modules
import type { GetServerSideProps, NextPage } from "next";
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

// Types
import { TeachersListGroup } from "@utils/types/teachers";
import { Teacher } from "@utils/types/person";

// Utils
import { nameJoiner } from "@utils/helpers/name";

// Page
const Teachers: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["teacher", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  const teacherList: TeachersListGroup[] = [];

  const [mainContent, setMainContent] = useState<Teacher | null>(null);

  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (teacherList.length > 0) {
      setMainContent(teacherList[0].content[0].content);
    }
  }, [teacherList]);

  return (
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
              {mainContent?.profile && (
                <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                  <ProfilePicture src={mainContent.profile} />
                </div>
              )}
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
          {mainContent?.contacts && (
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
                      <Card type="horizontal">
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
                            <div className="flex gap-4">
                              <p>{subject.code[locale]}</p>
                              <p className="font-medium">
                                {(subject.name[locale] || subject.name.th).name}
                              </p>
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
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const teachers = await getTeacherList(
    await getClassIDFromNumber(Number(params?.classNumber))
  );

  console.log(teachers);

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "teacher",
      ])),
    },
  };
};

export default Teachers;
