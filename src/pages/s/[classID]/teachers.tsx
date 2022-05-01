// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { CardList, ListLayout, ListSection, MaterialIcon, RegularLayout, Section, Title } from "@suankularb-components/react";

// Page
const Teachers: NextPage = (): JSX.Element => {
    const { t } = useTranslation(["teacher", "common"]);
    const locale = useRouter().locale == "th" ? "th" : "en-US";
  return (
    <ListLayout
    show={true}
    Title={
      <Title
        name={{ title:  t("title")}}
        pageIcon={<MaterialIcon icon="school"/>}
        backGoesTo="/account/login"
        LinkElement={Link}
      />
    }
  >
    <ListSection>
      <CardList
        listGroups={[
          {
            groupName: "hello",
            content: [
              {
                id: 0,
                content: "hi",
              }
            ]
          }
        ]}
      />
    </ListSection>
    <p>TODO</p>
  </ListLayout>
  )
  
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "teacher"])),
  },
});

export default Teachers;