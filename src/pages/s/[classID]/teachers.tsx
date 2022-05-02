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
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";
import { TeachersList } from "@utils/types/teachers";
import TeacherCard from "@components/TeacherCard";

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
            ],
          },
        },
      ],
    },
  ];

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
                  // setPolicy(Parties[0].policy);
                  // setMainType("policy");
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
      <p>TODO</p>
    </ListLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "teacher"])),
  },
});

export default Teachers;
