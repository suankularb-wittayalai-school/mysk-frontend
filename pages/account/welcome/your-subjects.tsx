// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Columns,
  ContentLayout,
  FormItem,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  Snackbar,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import ClassesField from "@/components/class/ClassesField";
import BlockingPane from "@/components/common/BlockingPane";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import NextWarningCard from "@/components/welcome/NextWarningCard";
import RightCardList from "@/components/welcome/RightCardList";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import {
  getTeachSubjectList,
  updateRoomSubjectsFromTeachSubjects,
} from "@/utils/backend/subject/roomSubject";
import { getSubjectsInCharge } from "@/utils/backend/subject/subject";
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SubjectWNameAndCode, TeacherSubjectItem } from "@/utils/types/subject";

const AddSubjectCard: FC<{
  subjectsInCharge: SubjectWNameAndCode[];
  addSubject: (subject: TeacherSubjectItem) => void;
}> = ({ subjectsInCharge, addSubject }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("welcome");

  // Form control
  const { form, setForm, resetForm, openFormSnackbar, formOK, formProps } =
    useForm<"subject" | "classes" | "isCoteacher">([
      { key: "subject", defaultValue: subjectsInCharge[0]?.id },
      { key: "classes", defaultValue: [], required: true },
      { key: "isCoteacher", defaultValue: false },
    ]);

  // When the available subjects change, set the selected subject to the first
  useEffect(
    () => setForm({ ...form, subject: subjectsInCharge[0]?.id }),
    [subjectsInCharge]
  );

  return (
    <Section className="relative -left-4 !-mx-4 px-4 sm:left-0 sm:!mx-0 sm:px-0">
      <BlockingPane
        icon={
          <MaterialIcon
            icon="arrow_downward"
            size={48}
            className="sm:-rotate-90"
          />
        }
        open={!subjectsInCharge.length}
      >
        You have already added all subjects you’re in charge of. You can still
        edit classes on the final list.
      </BlockingPane>
      <Card appearance="outlined">
        <CardHeader title={t("yourSubjects.subjects.addSubject.title")} />
        <CardContent>
          <p>{t("yourSubjects.subjects.addSubject.desc")}</p>
          <p>
            <Trans
              i18nKey="yourSubjects.subjects.addSubject.classesExplain"
              ns="welcome"
            >
              <kbd className="kbd">Enter ↵</kbd>
            </Trans>
          </p>
          <Columns columns={2} className="my-4 !gap-y-4">
            <Select
              appearance="outlined"
              label={t("yourSubjects.subjects.subject.subject")}
              {...formProps.subject}
            >
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
            <FormItem
              label={t("yourSubjects.subjects.subject.isCoteacher")}
              className="sm:col-span-2"
            >
              <Checkbox
                value={form.isCoteacher}
                onChange={(value) => setForm({ ...form, isCoteacher: value })}
              />
            </FormItem>
          </Columns>
          <Actions>
            <Button
              appearance="tonal"
              icon={
                <MaterialIcon icon="arrow_downward" className="sm:-rotate-90" />
              }
              disabled={!subjectsInCharge.length}
              onClick={() => {
                openFormSnackbar();
                if (!formOK) return;
                addSubject({
                  id: form.subject,
                  subject: subjectsInCharge.find(
                    (subjectInCharge) => form.subject === subjectInCharge.id
                  )!,
                  classes: form.classes,
                  isCoteacher: form.isCoteacher,
                });
                resetForm();
              }}
            >
              {t("yourSubjects.subjects.addSubject.action.add")}
            </Button>
          </Actions>
        </CardContent>
      </Card>
    </Section>
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
    <motion.li
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
            alt={t("yourSubjects.subjects.subject.action.delete")}
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
          <FormItem
            label={t("yourSubjects.subjects.subject.isCoteacher")}
            className="sm:col-span-2"
            labelAttr={{
              htmlFor: `checkbox-coteacher-subject-${roomSubject.id}`,
            }}
          >
            <Checkbox
              value={roomSubject.isCoteacher}
              onChange={(value) =>
                onChange({ ...roomSubject, isCoteacher: value })
              }
              inputAttr={{
                id: `checkbox-coteacher-subject-${roomSubject.id}`,
              }}
            />
          </FormItem>
        </CardContent>
      </Card>
    </motion.li>
  );
};

const SubjectsSection: FC<{
  subjectsInCharge: SubjectWNameAndCode[];
  teachSubjects: TeacherSubjectItem[];
  setTeachSubjects: (teachSubjects: TeacherSubjectItem[]) => void;
}> = ({ subjectsInCharge, teachSubjects, setTeachSubjects }) => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header>{t("yourSubjects.subjects.title")}</Header>
      <Columns
        columns={2}
        className={!teachSubjects.length ? "!items-stretch" : undefined}
      >
        <AddSubjectCard
          subjectsInCharge={subjectsInCharge.filter(
            (subject) =>
              !teachSubjects.find(
                (roomSubject) => subject.id === roomSubject.id
              )
          )}
          addSubject={(subject) =>
            setTeachSubjects(
              [...teachSubjects, subject].sort((a, b) =>
                a.subject.code.th > b.subject.code.th ? 1 : -1
              )
            )
          }
        />
        <RightCardList
          emptyText={t("yourSubjects.subjects.subject.noSubjects")}
          isEmpty={!teachSubjects.length}
        >
          {teachSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              roomSubject={subject}
              onChange={(subject) =>
                setTeachSubjects(
                  teachSubjects.map((mapSubject) =>
                    subject.id === mapSubject.id ? subject : mapSubject
                  )
                )
              }
              onDelete={() =>
                setTeachSubjects(
                  teachSubjects.filter(
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
  teachSubjectList: TeacherSubjectItem[];
  teacherID: number;
}> = ({ subjectsInCharge, teachSubjectList, teacherID }) => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  // Supabase
  const supabase = useSupabaseClient();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Router
  const router = useRouter();

  // Form control
  const [teachSubjects, setTeachSubjects] =
    useState<TeacherSubjectItem[]>(teachSubjectList);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    withLoading(async () => {
      const { error } = await updateRoomSubjectsFromTeachSubjects(
        supabase,
        teachSubjects,
        teacherID
      );

      if (error) {
        setSnackbar(
          <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      router.push("/account/welcome/logging-in");
      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("yourSubjects.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("yourSubjects.title")}
        icon={<MaterialIcon icon="book" />}
        parentURL="/account/welcome/covid-19-safety"
      />
      <ContentLayout>
        <NextWarningCard />
        <SubjectsSection
          subjectsInCharge={subjectsInCharge}
          teachSubjects={teachSubjects}
          setTeachSubjects={setTeachSubjects}
        />
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="filled"
            onClick={handleSubmit}
            loading={loading || undefined}
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

  const teacherID = metadata!.teacher!;

  const { data: subjectsInCharge } = await getSubjectsInCharge(
    supabase,
    teacherID
  );

  const { data: teachSubjectList } = await getTeachSubjectList(
    supabase,
    teacherID
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
      ])),
      subjectsInCharge,
      teachSubjectList,
      teacherID,
    },
  };
};

YourSubjectsPage.childURLs = ["/account/welcome/logging-in"];

YourSubjectsPage.navType = "hidden";

export default YourSubjectsPage;
