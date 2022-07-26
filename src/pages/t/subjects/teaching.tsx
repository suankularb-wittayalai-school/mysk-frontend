// Modules
import { motion } from "framer-motion";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "react-query";

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

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getTeacherIDFromReq } from "@utils/backend/person/teacher";
import { getTeachingSubjects } from "@utils/backend/subject/subject";

// Types
import { SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { protectPageFor } from "@utils/helpers/route";

const SubjectsTeaching: NextPage<{ teacherID: number }> = ({ teacherID }) => {
  const { t } = useTranslation("subjects");
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { data } = useQuery<
    (SubjectWNameAndCode & { classes: ClassWNumber[] })[]
  >("feed", () => getTeachingSubjects(teacherID));

  const [subjects, setSubjects] = useState<
    (SubjectWNameAndCode & { classes: ClassWNumber[] })[]
  >([]);
  useEffect(() => {
    if (data) setSubjects(data);
  }, [data]);

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
          <ul className="layout-grid-cols-3">
            {subjects.map((subject) => (
              <motion.li
                key={subject.id}
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                transition={animationTransition}
              >
                <SubjectCard subject={subject} />
              </motion.li>
            ))}
          </ul>
        </Section>
      </RegularLayout>
      <AddSubjectDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {
          setShowAdd(false);
          queryClient.invalidateQueries("subjects");
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const redirect = await protectPageFor("teacher", req);
  if (redirect) return redirect;

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
      teacherID: await getTeacherIDFromReq(req),
    },
  };
};

export default SubjectsTeaching;
