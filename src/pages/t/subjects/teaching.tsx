// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

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
import { Subject, SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";
import { useTeacherAccount } from "@utils/hooks/auth";
import { supabase } from "@utils/supabaseClient";
import {
  RoomSubjectDB,
  RoomSubjectTable,
  SubjectDB,
} from "@utils/types/database/subject";
import { db2Subject } from "@utils/backend/database";

const SubjectsTeaching: NextPage = () => {
  const { t } = useTranslation("subjects");
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [teacher, session] = useTeacherAccount({ loginRequired: true });

  const [subjects, setSubjects] = useState<
    (SubjectWNameAndCode & { classes: ClassWNumber[] })[]
  >([]);

  async function getSubjects() {
    if (!teacher) return [];

    const { data: roomSubjects, error } = await supabase
      .from<RoomSubjectDB>("RoomSubject")
      .select("*, subject:subject(*), classroom:class(*)")
      // .in("subject", teacher.subjectsInCharge?.map((s) => s.id) ?? [])
      .contains("teacher", [teacher.id]);

    if (error) {
      console.error(error);
      return [];
    }

    const subjects: (SubjectWNameAndCode & {
      classes: ClassWNumber[];
    })[] = await Promise.all(
      roomSubjects.map(async (rs) => {
        const fullSubject = await db2Subject(rs.subject);
        const subject: SubjectWNameAndCode & { classes: ClassWNumber[] } = {
          id: fullSubject.id,
          name: fullSubject.name,
          code: fullSubject.code,
          classes: [],
        };
        subject.classes = [
          { id: rs.classroom.id, number: rs.classroom.number },
        ];
        return subject;
      })
    );
    // merge classes array of subjects with same id
    const subjectsWithClasses = subjects.reduce((acc, subject) => {
      const existing = acc.find((s) => s.id === subject.id);
      if (existing) {
        existing.classes = [...existing.classes, ...subject.classes];
      } else {
        acc.push(subject);
      }
      return acc;
    }, [] as (SubjectWNameAndCode & { classes: ClassWNumber[] })[]);
    // console.log(subjectsWithClasses);
    return subjectsWithClasses;
  }

  useEffect(() => {
    if (teacher) {
      getSubjects().then((subjects) => setSubjects(subjects));
    }
  }, [teacher]);

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
