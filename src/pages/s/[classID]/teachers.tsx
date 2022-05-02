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
          content: { name: "กฤชพล บุญพูลมี" },
        },
        {
          id: 2,
          content: { name: "กฤษฎา อัศวสกุลเกียรติ" },
        },
      ],
    },
    {
      groupName: "วิทยาศาสตร์",
      content: [
        {
          id: 3,
          content: { name: "ธนกร อรรจนาวัฒน์" },
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
              >
                <Card
                  type="horizontal"
                  className={className}
                  appearance="tonal"
                >
                  <CardHeader title={content.name} />
                </Card>
                {/* <TeacherCard 
                  teacher={}
                /> */}
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
