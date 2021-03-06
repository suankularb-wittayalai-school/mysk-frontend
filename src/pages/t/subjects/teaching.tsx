// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useReducer, useState } from "react";

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

// Backend
import { db2Subject } from "@utils/backend/database";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";
import { RoomSubjectDB } from "@utils/types/database/subject";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

const SubjectsTeaching: NextPage = () => {
  const { t } = useTranslation("subjects");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  // set a variable to toggle fetching
  const [fetch, toggleFetch] = useReducer((state: boolean) => !state, false);

  const [teacher, session] = useTeacherAccount({ loginRequired: true });

  const [subjects, setSubjects] = useState<
    (SubjectWNameAndCode & { classes: ClassWNumber[] })[]
  >([]);

  async function getSubjects() {
    if (!teacher) return [];

    const { data: roomSubjects, error } = await supabase
      .from<RoomSubjectDB>("room_subjects")
      .select("*, subject:subject(*), classroom:class(*)")
      // .in("subject", teacher.subjectsInCharge?.map((s) => s.id) ?? [])
      .contains("teacher", [teacher.id]);

    if (error || !roomSubjects) {
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
  }, [teacher, fetch]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("teaching.title"), t)}</title>
      </Head>
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
        onSubmit={() => {
          setShowAdd(false);
          toggleFetch();
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
    },
  };
};

export default SubjectsTeaching;
