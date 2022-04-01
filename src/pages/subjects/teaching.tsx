// Modules
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import SubjectCard from "@components/SubjectCard";

// Types
import { SubjectNameAndCode } from "@utils/types/subject";

const SubjectsTeaching: NextPage<{ subjects: Array<SubjectNameAndCode> }> = ({
  subjects,
}) => {
  const { t } = useTranslation("subjects");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("teaching.title") }}
          pageIcon={<MaterialIcon icon="school" />}
          backGoesTo="/home"
        />
      }
    >
      <Section>
        <div className="layout-grid-cols-3">
          <Search placeholder={t("teaching.subjects.search")} />
          <div className="col-span-2 flex flex-row items-end justify-end gap-2">
            <Button
              name={t("teaching.subjects.action.add")}
              type="tonal"
              onClick={() => {}}
            />
            <LinkButton
              name={t("teaching.subjects.action.seeSchedule")}
              type="filled"
              url="/t/1/schedule"
              LinkElement={Link}
            />
          </div>
        </div>
        <div className="layout-grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </Section>
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const subjects: Array<SubjectNameAndCode> = [
    {
      id: 26,
      code: { "en-US": "ENG32102", th: "อ32102" },
      name: {
        "en-US": { name: "English 4" },
        th: { name: "ภาษาอังกฤษ 4" },
      },
    }
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
      subjects,
    },
  };
};

export default SubjectsTeaching;
