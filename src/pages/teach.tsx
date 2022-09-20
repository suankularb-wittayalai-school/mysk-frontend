// Modules
import { motion } from "framer-motion";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useReducer, useState } from "react";

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
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";
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

const Teach: NextPage<{ teacherID: number }> = ({ teacherID }) => {
  const { t } = useTranslation("teach");

  // Dialog controls
  const [showLogOut, toggleShowLogOut] = useReducer(
    (value: boolean) => !value,
    false
  );
  const [showAdd, toggleShowAdd] = useReducer(
    (value: boolean) => !value,
    false
  );

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
            backGoesTo={toggleShowLogOut}
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

          {subjects.length == 0 ? (
            // Guide the user on how to add subjects
            <div>
              <Card type="stacked" appearance="tonal">
                <CardHeader
                  icon={
                    <MaterialIcon icon="block" className="text-secondary" />
                  }
                  title={<h3>{t("subjects.noSubjects.title")}</h3>}
                  label={t("subjects.noSubjects.subtitle")}
                />
                <CardSupportingText>
                  {t("subjects.noSubjects.supportingText")}
                </CardSupportingText>
                <CardActions>
                  <Button
                    label={t("subjects.action.add")}
                    type="filled"
                    onClick={toggleShowAdd}
                    className="w-full !text-center sm:w-fit"
                  />
                </CardActions>
              </Card>
            </div>
          ) : (
            // List of subjects the user teaches
            <>
              <LayoutGridCols cols={3}>
                <ul className="contents">
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
              </LayoutGridCols>
              <Actions>
                <Button
                  label={t("subjects.action.add")}
                  type="outlined"
                  onClick={toggleShowAdd}
                />
              </Actions>
            </>
          )}
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
      <AddSubjectDialog
        show={showAdd}
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
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
    ...(await serverSideTranslations(locale as string, ["common", "account", "teach"])),
    teacherID: await getTeacherIDFromReq(req),
  },
});

export default Teach;
