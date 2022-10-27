// External libraries
import { AnimatePresence, motion } from "framer-motion";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useReducer, useState } from "react";

// SK Components
import {
  RegularLayout,
  Title,
  MaterialIcon,
  Section,
  LayoutGridCols,
  Card,
  CardHeader,
  CardSupportingText,
  Header,
  Actions,
  Button,
  KeyboardInput,
  CardActions,
  LinkButton,
  NativeInput,
  Dropdown,
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getUserFromReq } from "@utils/backend/person/person";
import { getSubjectGroups } from "@utils/backend/subject/subjectGroup";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode } from "@utils/types/common";
import { Role, Student, Teacher } from "@utils/types/person";
import { SubjectGroup } from "@utils/types/subject";

// Miscellaneous
import { citizenIDPattern } from "@utils/patterns";
import { range } from "@utils/helpers/array";
import { supabase } from "@utils/supabaseClient";

// Sections
const HeroSection = ({
  role,
  incrementStep,
  toggleShowLogOut,
  disabled,
}: {
  role: Role;
  incrementStep: () => void;
  toggleShowLogOut: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("landing");

  return (
    <LayoutGridCols cols={3}>
      <Section className="sm:!gap-4 md:col-span-2">
        <div>
          <Image
            src="/images/welcome.svg"
            alt={t("welcome.hero.graphicAlt")}
            width={142}
            height={96}
          />
        </div>
        <div className="gap-2 font-display">
          <h2 className="text-7xl leading-tight">{t("welcome.hero.title")}</h2>
          <p className="text-3xl">{t(`welcome.hero.subtitle.${role}`)}</p>
        </div>
        <p>{t("welcome.hero.notice")}</p>
        <Actions className="mt-2">
          <Button
            label={t("welcome.hero.action.logOut")}
            type="outlined"
            icon={<MaterialIcon icon="logout" />}
            onClick={toggleShowLogOut}
            disabled={disabled}
            isDangerous
          />
          <Button
            label={t("welcome.hero.action.continue")}
            type="filled"
            icon={<MaterialIcon icon="arrow_downward" />}
            onClick={incrementStep}
            disabled={disabled}
          />
        </Actions>
      </Section>
      <Section className="!hidden sm:!flex">
        <Header
          icon={<MaterialIcon icon="checklist" allowCustomSize />}
          text={t("welcome.nextSteps.title")}
        />
        {[
          {
            icon: <MaterialIcon icon="badge" />,
            title: t("welcome.nextSteps.dataCheck.title"),
            desc: t("welcome.nextSteps.dataCheck.desc"),
          },
          {
            icon: <MaterialIcon icon="password" />,
            title: t("welcome.nextSteps.newPassword.title"),
            desc: t("welcome.nextSteps.newPassword.desc"),
          },
          role == "teacher" && {
            icon: <MaterialIcon icon="school" />,
            title: t("welcome.nextSteps.prepareForStudents.title"),
            desc: t("welcome.nextSteps.prepareForStudents.desc"),
          },
          {
            icon: <MaterialIcon icon="login" />,
            title: t("welcome.nextSteps.done.title"),
            desc: t("welcome.nextSteps.done.desc"),
          },
        ].map(
          (step) =>
            step && (
              <Card key={step.title} type="stacked" appearance="tonal">
                <CardHeader icon={step.icon} title={<h3>{step.title}</h3>} />
                <CardSupportingText>{step.desc}</CardSupportingText>
              </Card>
            )
        )}
      </Section>
    </LayoutGridCols>
  );
};

const DataCheckSection = ({
  user,
  subjectGroups,
  incrementStep,
  disabled,
}: {
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
  incrementStep: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["landing", "account"]);
  const locale = useRouter().locale as LangCode;

  // Form control
  const [form, setForm] = useState({
    thPrefix: user.prefix?.th || "",
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName || "",
    thLastName: user.name.th.lastName || "",
    enPrefix: user.prefix?.["en-US"] || "",
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
    studentID: user.role == "student" ? user.studentID : "",
    teacherID: user.role == "teacher" ? user.teacherID : "",
    citizenID: user.citizenID,
    birthDate: user.birthdate,
    subjectGroup: user.role == "teacher" ? user.subjectGroup.id : 0,
  });

  return (
    <motion.div
      initial={{ scale: 0.8, y: -280, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -280, opacity: 0 }}
      transition={animationTransition}
    >
      <Section
        // Bottom Navigation blocks some of the Subject Group options on mobile.
        // 144px just about show every option.
        style={{ paddingBottom: user.role == "teacher" && !disabled ? 144 : 0 }}
      >
        <Header
          icon={<MaterialIcon icon="badge" allowCustomSize />}
          text={t("welcome.dataCheck.title")}
        />

        {/* Local name (Thai) */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.name.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="th-prefix"
              type="text"
              label={t("profile.name.prefix", { ns: "account" })}
              helperMsg={t("profile.name.prefix_helper", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thPrefix: e })}
              defaultValue={user.prefix?.th}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-first-name"
              type="text"
              label={t("profile.name.firstName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thFirstName: e })}
              defaultValue={user.name.th.firstName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-middle-name"
              type="text"
              label={t("profile.name.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thMiddleName: e })}
              defaultValue={user.name.th.middleName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-last-name"
              type="text"
              label={t("profile.name.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thLastName: e })}
              defaultValue={user.name.th.lastName}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* English name */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.enName.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="en-prefix"
              type="text"
              label={t("profile.enName.prefix", { ns: "account" })}
              helperMsg={t("profile.enName.prefix_helper", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thPrefix: e })}
              defaultValue={user.prefix?.["en-US"]}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-first-name"
              type="text"
              label={t("profile.enName.firstName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enFirstName: e })}
              defaultValue={user.name["en-US"]?.firstName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-middle-name"
              type="text"
              label={t("profile.enName.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enMiddleName: e })}
              defaultValue={user.name["en-US"]?.middleName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-last-name"
              type="text"
              label={t("profile.enName.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enLastName: e })}
              defaultValue={user.name["en-US"]?.lastName}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* General info */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.general.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="citizen-id"
              type="text"
              label={t("profile.general.citizenID", { ns: "account" })}
              onChange={(e) => setForm({ ...form, citizenID: e })}
              defaultValue={user.citizenID}
              attr={{ pattern: citizenIDPattern, disabled }}
            />
            <NativeInput
              name="birth-date"
              type="date"
              label={t("profile.general.birthDate", { ns: "account" })}
              onChange={(e) => setForm({ ...form, birthDate: e })}
              defaultValue={user.birthdate}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* Role */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.role.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            {user.role == "teacher" ? (
              <>
                <KeyboardInput
                  name="teacher-id"
                  type="text"
                  label={t("profile.role.teacherID", { ns: "account" })}
                  onChange={(e) => setForm({ ...form, teacherID: e })}
                  defaultValue={user.teacherID}
                  attr={{ disabled }}
                />
                <Dropdown
                  name="subject-group"
                  label={t("profile.role.subjectGroup", { ns: "account" })}
                  options={subjectGroups.map((subjectGroup) => ({
                    value: subjectGroup.id,
                    label: getLocaleString(subjectGroup.name, locale),
                  }))}
                  onChange={(e: number) =>
                    setForm({ ...form, subjectGroup: e })
                  }
                  defaultValue={user.subjectGroup.id}
                />
              </>
            ) : (
              <KeyboardInput
                name="student-id"
                type="number"
                label={t("profile.role.studentID", { ns: "account" })}
                onChange={(e) => setForm({ ...form, studentID: e })}
                defaultValue={user.studentID}
                attr={{ min: 10000, max: 99999, disabled }}
              />
            )}
          </div>
        </section>

        <Actions>
          <Button
            label={t("welcome.dataCheck.action.continue")}
            type="filled"
            icon={<MaterialIcon icon="arrow_downward" />}
            onClick={incrementStep}
            disabled={disabled}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const NewPasswordSection = ({
  incrementStep,
  disabled,
}: {
  incrementStep: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["landing", "account"]);

  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  return (
    <motion.div
      initial={{ scale: 0.8, y: -280, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -280, opacity: 0 }}
      transition={animationTransition}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="password" allowCustomSize />}
          text={t("welcome.newPassword.title")}
        />

        <p>{t("welcome.newPassword.desc")}</p>

        <LayoutGridCols cols={6}>
          <div className="col-span-4 md:col-start-2">
            <KeyboardInput
              name="new-password"
              type="password"
              label={t("dialog.changePassword.newPwd", { ns: "account" })}
              errorMsg={t("dialog.changePassword.newPwd_error", {
                ns: "account",
              })}
              useAutoMsg
              onChange={(e) => setForm({ ...form, newPassword: e })}
              attr={{ minLength: 8, disabled }}
            />
            <KeyboardInput
              name="confirm-new-password"
              type="password"
              label={t("dialog.changePassword.confirmNewPwd", {
                ns: "account",
              })}
              errorMsg={t("dialog.changePassword.newPwd_error", {
                ns: "account",
              })}
              useAutoMsg
              onChange={(e) => setForm({ ...form, confirmNewPassword: e })}
              attr={{ minLength: 8, disabled }}
            />
          </div>
        </LayoutGridCols>

        <Actions>
          <Button
            label={t("welcome.newPassword.action.continue")}
            type="filled"
            icon={
              <MaterialIcon
                icon="arrow_downward"
                className="rotate-0 transition-[transform] sm:-rotate-90"
              />
            }
            onClick={incrementStep}
            disabled={disabled}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const PreparingForStudentsSection = (): JSX.Element => {
  const { t } = useTranslation("landing");

  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.4, opacity: 0 }}
      transition={animationTransition}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="school" allowCustomSize />}
          text={t("welcome.preparingForStudents.title")}
        />
        <p className="text-tertiary">
          <strong>{t("welcome.preparingForStudents.notice")}</strong>
        </p>
        <p>{t("welcome.preparingForStudents.desc")}</p>
        <ol className="ml-6 list-decimal marker:font-display marker:text-outline">
          {range(3, 1).map((stepNo) => (
            <li key={`prep-step-${stepNo}`}>
              {t(`welcome.preparingForStudents.steps.${stepNo}`)}
            </li>
          ))}
        </ol>
      </Section>
    </motion.div>
  );
};

const DoneSection = ({ role }: { role: Role }): JSX.Element => {
  const { t } = useTranslation("landing");
  const router = useRouter();

  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.4, opacity: 0 }}
      transition={animationTransition}
      className={role == "teacher" ? "col-span-2" : undefined}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="login" allowCustomSize />}
          text={t("welcome.done.title")}
        />

        <LayoutGridCols cols={6}>
          <Card
            type="stacked"
            appearance="tonal"
            className={
              role == "teacher"
                ? "col-span-2 sm:col-start-2 md:col-start-3"
                : "col-span-4 md:col-start-2"
            }
          >
            {/* FIXME: When Card Media is added to React SK Components, change this */}
            <div className="card__media relative h-60">
              <Image
                src="/images/graphics/login.webp"
                layout="fill"
                objectFit="cover"
                alt={t("logIn.graphicAlt", { ns: "account" })}
              />
            </div>
            <CardSupportingText>
              <p>
                <Trans i18nKey="welcome.done.desc" ns="landing">
                  Everything is ready for you to start using MySK. If you have
                  any questions or concerns, visit the{" "}
                  <a href="/help" target="mysk-help" className="link">
                    help page
                  </a>
                  .
                </Trans>
              </p>
            </CardSupportingText>
            <CardActions>
              <Button
                label={t("welcome.done.action.finish")}
                type="filled"
                className="w-full !text-center"
                onClick={async () => {
                  await supabase.auth.update({ data: { onboarded: true } });
                  if (role == "teacher") router.push("/teach");
                  else router.push("/learn");
                }}
              />
            </CardActions>
          </Card>
        </LayoutGridCols>
      </Section>
    </motion.div>
  );
};

// Page
const Welcome: NextPage<{
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ user, subjectGroups }) => {
  const { t } = useTranslation(["landing", "common"]);

  const [currStep, incrementStep] = useReducer((value) => value + 1, 0);

  // Dialog control
  const [showLogOut, toggleShowLogOut] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("welcome.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("welcome.title") }}
            pageIcon={<MaterialIcon icon="waving_hand" />}
            backGoesTo={toggleShowLogOut}
          />
        }
      >
        <AnimatePresence>
          <HeroSection
            key="hero-section"
            role={user.role}
            incrementStep={incrementStep}
            toggleShowLogOut={toggleShowLogOut}
            disabled={currStep >= 1}
          />
          {currStep >= 1 && (
            <DataCheckSection
              key="data-check-section"
              user={user}
              subjectGroups={subjectGroups}
              incrementStep={incrementStep}
              disabled={currStep >= 2}
            />
          )}
          {currStep >= 2 && (
            <div className="layout-grid-cols-2 !gap-y-[inherit]">
              <NewPasswordSection
                key="new-password-section"
                incrementStep={incrementStep}
                disabled={currStep >= 3}
              />
              {currStep >= 3 && (
                <>
                  {user.role == "teacher" && (
                    <PreparingForStudentsSection key="preparing-for-students-section" />
                  )}
                  <DoneSection key="done-section" role={user.role} />
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </RegularLayout>
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const { data: user, error } = await getUserFromReq(req, res);
  if (error)
    return { redirect: { destination: "/account/login", permanent: false } };

  const { data: subjectGroups } = await getSubjectGroups();

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "landing",
      ])),
      user,
      subjectGroups,
    },
  };
};

export default Welcome;
