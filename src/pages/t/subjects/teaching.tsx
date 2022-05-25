// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

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
import AddSubjectDialog from "@components/dialogs/AddSubject";
import SubjectCard from "@components/SubjectCard";

// Types
import { SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";

const SubjectsTeaching: NextPage<{
  subjects: (SubjectWNameAndCode & { classes: ClassWNumber[] })[];
}> = ({ subjects }) => {
  const { t } = useTranslation("subjects");
  const [showAdd, setShowAdd] = useState<boolean>(false);

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("teaching.title") }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <h2 className="sr-only">{t("teaching.subjects.title")}</h2>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("teaching.subjects.search")} />
            <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:items-end md:col-span-2">
              <Button
                label={t("teaching.subjects.action.add")}
                type="outlined"
                onClick={() => setShowAdd(true)}
              />
              <LinkButton
                label={t("teaching.subjects.action.seeSchedule")}
                type="filled"
                url="/t/schedule"
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
      <AddSubjectDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => setShowAdd(false)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const subjects: (SubjectWNameAndCode & { classes: ClassWNumber[] })[] = [
    {
      id: 8,
      code: { "en-US": "I21202", th: "I21202" },
      name: {
        "en-US": { name: "Communication and Presentation" },
        th: { name: "การสื่อสารและการนำเสนอ" },
      },
      classes: [
        { id: 5, number: 105 },
        { id: 6, number: 106 },
      ],
    },
    {
      id: 19,
      code: { "en-US": "ENG20218", th: "อ20218" },
      name: {
        "en-US": { name: "Reading 6" },
        th: { name: "การอ่าน 6" },
      },
      classes: [
        { id: 21, number: 205 },
        { id: 22, number: 206 },
      ],
    },
    {
      id: 26,
      code: { "en-US": "ENG32102", th: "อ32102" },
      name: {
        "en-US": { name: "English 4" },
        th: { name: "ภาษาอังกฤษ 4" },
      },
      classes: [
        { id: 35, number: 501 },
        { id: 36, number: 502 },
        { id: 37, number: 503 },
        { id: 38, number: 504 },
      ],
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
