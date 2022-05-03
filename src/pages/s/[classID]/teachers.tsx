// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Card,
  CardHeader,
  CardList,
  ListLayout,
  ListSection,
  MainSection,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";
import { TeachersList } from "@utils/types/teachers";
import TeacherCard from "@components/TeacherCard";
import { useState } from "react";
import { nameJoiner } from "@utils/helpers/name";
import ContactChip from "@components/ContactChip";
import ProfilePicture from "@components/ProfilePicture";

// Page
const Teachers: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["teacher", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  const teacherList: TeachersList[] = [
    {
      groupName: "คณิตศาสตร์",
      content: [
        {
          id: 1,
          content: {
            id: 1,
            prefix: "missus",
            name: {
              "en-US": { firstName: "Krichapon", lastName: "Boonpoonmee" },
              th: { firstName: "กฤชพล", lastName: "บุญพูลมี" },
            },
            profile: "/images/dummybase/mattana.webp",
            role: "teacher",
            subjectsInCharge: [
              {
                id: 1,
                code: {
                  "en-US": "MATH6969",
                  th: "ค6969",
                },
                name: {
                  "en-US": {
                    name: "Core Mathematics",
                  },
                  th: { name: "คณิตศาสตร์พื้นๆ" },
                },
                subjectSubgroup: {
                  name: { "en-US": "Mathematics", th: "คณิตศาสตร์" },
                  subjectGroup: {
                    name: { "en-US": "Mathematics", th: "คณิตศาสตร์" },
                  },
                },
              },
            ],
            contacts: [
              {
                id: 1,
                name: {
                  "en-US": "xx_กฤชพล_บุญพูลมี_xx",
                  th: "xx_กฤชพล_บุญพูลมี_xx",
                },
                via: "facebook",
                value: "",
              },
            ],
          },
        },
        {
          id: 2,
          content: {
            id: 2,
            prefix: "miss",
            name: {
              "en-US": { firstName: "Krissada", lastName: "Krissy" },
              th: { firstName: "กฤษฎา", lastName: "อัศวสกุลเกียรติ" },
            },
            profile: "/images/dummybase/taradol.webp",
            role: "teacher",
            subjectsInCharge: [
              {
                id: 2,
                code: {
                  "en-US": "MATH69420",
                  th: "ค69420",
                },
                name: {
                  "en-US": {
                    name: "Additional Mathematics",
                  },
                  th: { name: "คณิตศาสตร์เพิ่มเติม" },
                },
                subjectSubgroup: {
                  name: { "en-US": "Mathematics", th: "คณิตศาสตร์" },
                  subjectGroup: {
                    name: { "en-US": "Mathematics", th: "คณิตศาสตร์" },
                  },
                },
              },
            ],
            contacts: [
              {
                id: 2,
                name: {
                  "en-US": "xx_Krissada_Krissy_xx",
                  th: "xx_Krissada_Krissy_xx",
                },
                via: "facebook",
                value: "",
              },
            ],
          },
        },
      ],
    },
    {
      groupName: "วิทยาศาสตร์",
      content: [
        {
          id: 3,
          content: {
            id: 3,
            prefix: "master",
            name: {
              "en-US": { firstName: "Thanakorn", lastName: "Arjanawut" },
              th: { firstName: "ธนกร", lastName: "อรรจนาวัฒน์" },
            },
            profile: "/images/dummybase/thanakorn.webp",
            role: "teacher",
            classAdvisorAt: {
              id: 1,
              name: {
                "en-US": "M.405",
                th: "ม.405",
              },
            },
            subjectsInCharge: [
              {
                id: 3,
                code: {
                  "en-US": "SCI6969",
                  th: "ว6969",
                },
                name: {
                  "en-US": {
                    name: "Core Science",
                  },
                  th: { name: "วิทยาศาสตร์พื้นๆ" },
                },
                subjectSubgroup: {
                  name: { "en-US": "Science", th: "วิทยาศาสตร์" },
                  subjectGroup: {
                    name: { "en-US": "Science", th: "วิทยาศาสตร์" },
                  },
                },
              },
              {
                id: 4,
                code: {
                  "en-US": "SCI42069",
                  th: "ว42069",
                },
                name: {
                  "en-US": {
                    name: "Additional Science",
                  },
                  th: { name: "วิทยาศาสตร์เพิ่มเติม" },
                },
                subjectSubgroup: {
                  name: { "en-US": "Science", th: "วิทยาศาสตร์" },
                  subjectGroup: {
                    name: { "en-US": "Science", th: "วิทยาศาสตร์" },
                  },
                },
              },
            ],
            contacts: [
              {
                id: 3,
                name: {
                  "en-US": "xx_ธนกร_อรรจนาวัฒน์_xx",
                  th: "xx_ธนกร_อรรจนาวัฒน์_xx",
                },
                via: "facebook",
                value: "",
              },
              {
                id: 4,
                name: {
                  "en-US": "ธนกร_อรรจนาวัฒน์xd",
                  th: "ธนกร_อรรจนาวัฒน์xd",
                },
                via: "line",
                value: "",
              },
              {
                id: 5,
                name: {
                  "en-US": "Thanacord",
                  th: "Thanacord",
                },
                via: "discord",
                value: "",
              },
            ],
          },
        },
      ],
    },
  ];

  const [mainContent, setMainContent] = useState(
    teacherList[0].content[0].content
  );

  const [showMain, setShowMain] = useState(false);

  mainContent.contacts.sort((a, b) =>
    a.via < b.via ? -1 : a.via > b.via ? 1 : 0
  );

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
            <div className="!sm:gap-6 !md:grid-cols-[1fr_5fr] grid !grid-cols-[1fr_3fr] items-stretch !gap-4">
              <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                <ProfilePicture src={mainContent.profile} />
              </div>
              <div className="!flex !flex-col !justify-between">
                <div>
                  <h2 className="text-4xl font-bold">
                    {nameJoiner(locale, mainContent.name)}
                  </h2>
                  <p className="text-2xl font-medium">
                    {
                      mainContent.subjectsInCharge[0].subjectSubgroup.name[
                        locale
                      ]
                    }
                  </p>
                </div>
                <div>
                  {mainContent.classAdvisorAt ? (
                    <p className="text-2xl font-medium">
                      {t("advisor", {
                        className: mainContent.classAdvisorAt.name[locale],
                      })}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </Section>
          <Section>
            <h3 className="text-3xl font-bold">{t("contacts")}</h3>
            <ul className="layout-grid-cols-2">
              {mainContent.contacts.map((contact) => (
                <ContactChip
                  key={contact.id}
                  contact={contact}
                  className="!w-initial"
                />
              ))}
            </ul>
          </Section>
          <Section>
            <h3 className="text-3xl font-bold">{t("subjects")}</h3>
            <ul className="!flex flex-col gap-2">
              {mainContent.subjectsInCharge.map((subjects) => (
                <li>
                  <Card type="horizontal">
                    <CardHeader
                      icon={
                        <MaterialIcon
                          icon={
                            subjects.subjectSubgroup.name["en-US"] === "Science"
                              ? "biotech"
                              : subjects.subjectSubgroup.name["en-US"] ===
                                "Mathematics"
                              ? "calculate"
                              : "circle"
                          }
                        />
                      }
                      title={
                        <div className="!flex gap-4">
                          <p>{subjects.code[locale]}</p>
                          <p className="font-medium">
                            {subjects.name[locale].name}
                          </p>
                        </div>
                      }
                    />
                  </Card>
                </li>
              ))}
            </ul>
          </Section>
        </Section>
      </MainSection>
    </ListLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "teacher"])),
  },
});

export default Teachers;
