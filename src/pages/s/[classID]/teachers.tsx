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
          },
        },
      ],
    },
  ];

  const [showMain, setShowMain] = useState(teacherList[0].content[0].content);

  return (
    <ListLayout
      show={true}
      Title={
        <Title
          name={{ title: t("title") }}
          pageIcon={<MaterialIcon icon="school" />}
          backGoesTo="/account/login"
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
                  setShowMain(content);
                }}
                className="!w-full"
              >
                {/* <Card
                  type="horizontal"
                  className={className}
                  appearance="tonal"
                >
                  <CardHeader title={content.name} />
                </Card> */}
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
        <Section className="!font-display">
          <h2 className="text-4xl font-bold">
            {nameJoiner(locale, showMain.name)}
          </h2>
          <p className="text-2xl">
            {showMain.subjectsInCharge[0].subjectSubgroup.name[locale]}
          </p>
          <Section>
            <h3 className="text-3xl font-bold">{t("contacts")}</h3>
          </Section>
          <Section>
            <h3 className="text-3xl font-bold">{t("subjects")}</h3>
            <ul className="!flex flex-col gap-2">
              {showMain.subjectsInCharge.map((subjects) => (
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
                          <p className="font-medium">{subjects.name[locale].name}</p>
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
