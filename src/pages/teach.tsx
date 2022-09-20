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
  Actions,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Header,
  LayoutGridCols,
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

const SubjectsTeaching: NextPage<{ teacherID: number }> = ({ teacherID }) => {
  const { t } = useTranslation("teach");
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
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <div className="md:col-span-2">
              <Header
                icon={<MaterialIcon icon="library_books" allowCustomSize />}
                text={t("subjects.title")}
              />
            </div>
            <Search placeholder={t("subjects.search")} />
          </LayoutGridCols>
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
}) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "teach"])),
    teacherID: await getTeacherIDFromReq(req),
  },
});

export default SubjectsTeaching;
