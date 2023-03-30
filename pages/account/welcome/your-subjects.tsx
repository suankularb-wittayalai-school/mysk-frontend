// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import ClassesField from "@/components/class/ClassesField";
import NextWarningCard from "@/components/welcome/NextWarningCard";
import RightCardList from "@/components/welcome/RightCardList";

// Backend
import { getSubjectsInCharge } from "@/utils/backend/subject/subject";
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SubjectWNameAndCode, TeacherSubjectItem } from "@/utils/types/subject";

const AddSubjectCard: FC<{
  subjectsInCharge: SubjectWNameAndCode[];
  addSubject: (subject: TeacherSubjectItem) => void;
}> = ({ subjectsInCharge, addSubject }) => {
  // Translation
  const locale = useLocale();

  // Form control
  const { form, setForm, resetForm, openFormSnackbar, formOK, formProps } =
    useForm<"subject" | "classes">([
      { key: "subject", defaultValue: subjectsInCharge[0]?.id },
      { key: "classes", defaultValue: [], required: true },
    ]);

  // When the available subjects change, set the selected subject to the first
  useEffect(
    () => setForm({ ...form, subject: subjectsInCharge[0]?.id }),
    [subjectsInCharge]
  );

  return (
    <Card appearance="outlined">
      <CardHeader title="Add a subject" />
      <CardContent>
        <p>
          Select from a list of subjects, specify which classes learn that
          subject with you, and add it to the final list.
        </p>
        <Columns columns={2} className="my-4 !gap-y-4">
          <Select appearance="outlined" label="Subject" {...formProps.subject}>
            {subjectsInCharge.map((subjectInCharge) => (
              <MenuItem key={subjectInCharge.id} value={subjectInCharge.id}>
                {getLocaleObj(subjectInCharge.name, locale).name}
              </MenuItem>
            ))}
          </Select>
          <ClassesField
            classes={form.classes}
            onChange={(classes) => setForm({ ...form, classes })}
          />
        </Columns>
        <Actions>
          <Button
            appearance="tonal"
            icon={
              <MaterialIcon icon="arrow_downward" className="sm:-rotate-90" />
            }
            onClick={() => {
              openFormSnackbar();
              if (!formOK) return;
              addSubject({
                id: form.subject,
                subject: subjectsInCharge.find(
                  (subjectInCharge) => form.subject === subjectInCharge.id
                )!,
                classes: form.classes,
              });
              resetForm();
            }}
          >
            Add subject
          </Button>
        </Actions>
      </CardContent>
    </Card>
  );
};

const SubjectCard: FC<{
  roomSubject: TeacherSubjectItem;
  onChange: (subject: TeacherSubjectItem) => void;
  onDelete: () => void;
}> = ({ roomSubject, onChange, onDelete }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["welcome", "common"]);

  // Animation
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0.8,
        opacity: 0,
        transition: transition(duration.short4, easing.emphasizedAccelerate),
      }}
      layoutId={["subject", roomSubject.id].join("-")}
      transition={transition(duration.medium2, easing.standard)}
    >
      <Card appearance="filled">
        <div className="flex flex-row items-center">
          <CardHeader
            title={getLocaleObj(roomSubject.subject.name, locale).name}
            subtitle={getLocaleString(roomSubject.subject.code, locale)}
            className="grow"
          />
          <Button
            appearance="text"
            icon={<MaterialIcon icon="delete" />}
            alt="Delete"
            dangerous
            onClick={onDelete}
            className="!mr-3"
          />
        </div>
        <CardContent>
          <ClassesField
            classes={roomSubject.classes}
            onChange={(classes) => onChange({ ...roomSubject, classes })}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SubjectsSection: FC<{ subjectsInCharge: SubjectWNameAndCode[] }> = ({
  subjectsInCharge,
}) => {
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
        <AddSubjectCard
          subjectsInCharge={subjectsInCharge.filter(
            (subject) =>
              !roomSubjects.find((roomSubject) => subject.id === roomSubject.id)
          )}
          addSubject={(subject) => setRoomSubjects([...roomSubjects, subject])}
        />
        <RightCardList
          emptyText="Connect a subject to its classes for it to show up
            here."
          isEmpty={!roomSubjects.length}
        >
          {roomSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              roomSubject={subject}
              onChange={(subject) =>
                setRoomSubjects(
                  roomSubjects.map((mapSubject) =>
                    subject.id === mapSubject.id ? subject : mapSubject
                  )
                )
              }
              onDelete={() =>
                setRoomSubjects(
                  roomSubjects.filter(
                    (mapSubject) => subject.id !== mapSubject.id
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

const YourSubjectsPage: CustomPage<{
  subjectsInCharge: SubjectWNameAndCode[];
}> = ({ subjectsInCharge }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourSubjects.title"), t)}</title>
      </Head>
      <ContentLayout>
        <NextWarningCard />
        <SubjectsSection subjectsInCharge={subjectsInCharge} />
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  const { data: subjectsInCharge } = await getSubjectsInCharge(
    supabase,
    metadata!.teacher!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      subjectsInCharge,
    },
  };
};

YourSubjectsPage.pageHeader = {
  title: { key: "yourSubjects.title", ns: "welcome" },
  icon: <MaterialIcon icon="book" />,
  parentURL: "/account/welcome/covid-19-safety",
};

YourSubjectsPage.childURLs = ["/account/welcome/logging-in"];

export default YourSubjectsPage;
