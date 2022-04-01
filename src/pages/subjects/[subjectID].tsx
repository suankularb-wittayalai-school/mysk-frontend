// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Types
import { Subject } from "@utils/types/subject";

const SubjectDetails: NextPage<{ subject: Subject }> = ({ subject }) => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <RegularLayout
      Title={
        <Title
          name={{
            title: subject.name[locale].name,
            subtitle: subject.code[locale],
          }}
          pageIcon={<MaterialIcon icon="school" />}
          backGoesTo="/subjects/teaching"
          LinkElement={Link}
        />
      }
    >
      <Section>TODO</Section>
    </RegularLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const subject: Subject = {
    id: 26,
    code: { "en-US": "ENG32102", th: "อ32102" },
    name: {
      "en-US": { name: "English 4" },
      th: { name: "ภาษาอังกฤษ 4" },
    },
    teachers: [],
    subjectSubgroup: {
      name: { "en-US": "English", th: "ภาษาอังกฤษ" },
      subjectGroup: {
        name: { "en-US": "Foreign Language", th: "ภาษาต่างประเทศ" },
      },
    },
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
      subject,
    },
  };
};

export default SubjectDetails;
