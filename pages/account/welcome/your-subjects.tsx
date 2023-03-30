// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  ChipField,
  ChipSet,
  Columns,
  ContentLayout,
  Header,
  InputChip,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
} from "@suankularb-components/react";

// Internal components
import ClassesField from "@/components/class/ClassesField";
import NextWarningCard from "@/components/welcome/NextWarningCard";
import RightCardList from "@/components/welcome/RightCardList";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { TeacherSubjectItem } from "@/utils/types/subject";
import { ClassWNumber } from "@/utils/types/class";

const AddSubjectCard: FC = () => {
  // Form control
  const [classes, setClasses] = useState<ClassWNumber[]>([]);

  return (
    <Card appearance="outlined">
      <CardHeader title="Add a subject" />
      <CardContent>
        <p>
          Select from a list of subjects, specify which classes learn that
          subject with you, and add it to the final list.
        </p>
        <Columns columns={2} className="my-4 !gap-y-4">
          <Select appearance="outlined" label="Subject">
            <MenuItem value={1}>Media Production 2</MenuItem>
            <MenuItem value={2}>Writing Web Page 2</MenuItem>
          </Select>
          <ClassesField classes={classes} onChange={setClasses} />
        </Columns>
        <Actions>
          <Button
            appearance="tonal"
            icon={
              <MaterialIcon icon="arrow_downward" className="sm:-rotate-90" />
            }
          >
            Add subject
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

const SubjectCard: FC<{
  subject: TeacherSubjectItem;
  onChange: (subject: TeacherSubjectItem) => void;
}> = ({ subject, onChange }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <Card appearance="filled">
      <div className="flex flex-row items-center">
        <CardHeader title="Media Production 2" className="grow" />
        <Button
          appearance="text"
          icon={<MaterialIcon icon="delete" />}
          alt="Delete"
          dangerous
          className="!mr-3"
        />
      </div>
      <CardContent>
        <ClassesField classes={[]} onChange={() => {}} />
      </CardContent>
    </Card>
  );
};

const SubjectsSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  // Form control
  const [roomSubjects, setRoomSubjects] = useState<TeacherSubjectItem[]>([]);

  return (
    <Section>
      <Header>Subjects and classes</Header>
      <Columns
        columns={2}
        className={!roomSubjects.length ? "!items-stretch" : undefined}
      >
        <AddSubjectCard />
        <RightCardList
          emptyText="Connect a subject to its classes for it to show up
            here."
          isEmpty={!roomSubjects.length}
        >
          {roomSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onChange={(subject) =>
                setRoomSubjects(
                  roomSubjects.map((mapSubject) =>
                    subject.id === mapSubject.id ? subject : mapSubject
                  )
                )
              }
            />
          ))}
        </RightCardList>
      </Columns>
    </Section>
  );
};

const YourSubjectsPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourSubjects.title"), t)}</title>
      </Head>
      <ContentLayout>
        <NextWarningCard />
        <SubjectsSection />
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            href="/account/welcome/logging-in"
            element={Link}
          >
            {t("common.action.next")}
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "welcome",
    ])),
  },
});

YourSubjectsPage.pageHeader = {
  title: { key: "yourSubjects.title", ns: "welcome" },
  icon: <MaterialIcon icon="book" />,
  parentURL: "/account/welcome/covid-19-safety",
};

YourSubjectsPage.childURLs = ["/account/welcome/logging-in"];

export default YourSubjectsPage;
