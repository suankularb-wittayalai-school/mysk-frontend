// Modules
import { GetServerSideProps, NextPage } from "next";
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
import { SubjectWNameAndCode } from "@utils/types/subject";

const SubjectsTeaching: NextPage<{ subjects: Array<SubjectWNameAndCode> }> = ({
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
        <h2 className="sr-only">{t("teaching.subjects.title")}</h2>
        <div className="layout-grid-cols-3">
          <Search placeholder={t("teaching.subjects.search")} />
          <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:items-end md:col-span-2">
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const subjects: Array<SubjectWNameAndCode> = [
    {
      id: 8,
      code: { "en-US": "I21202", th: "I21202" },
      name: {
        "en-US": { name: "Communication and Presentation" },
        th: { name: "การสื่อสารและการนำเสนอ" },
      },
    },
    {
      id: 19,
      code: { "en-US": "ENG20218", th: "อ20218" },
      name: {
        "en-US": { name: "Reading 6" },
        th: { name: "การอ่าน 6" },
      },
    },
    {
      id: 26,
      code: { "en-US": "ENG32102", th: "อ32102" },
      name: {
        "en-US": { name: "English 4" },
        th: { name: "ภาษาอังกฤษ 4" },
      },
    },
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
