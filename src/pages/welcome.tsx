// External libraries
import { AnimatePresence, motion } from "framer-motion";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "next-i18next";
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
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getUserFromReq } from "@utils/backend/person/person";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode } from "@utils/types/common";
import { Role, Student, Teacher } from "@utils/types/person";

// Miscellaneous
import { citizenIDPattern } from "@utils/patterns";

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
  incrementStep,
  disabled,
}: {
  user: Student | Teacher;
  incrementStep: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["landing", "account"]);

  // Form control
  const [form, setForm] = useState({
    thPrefix: "",
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName || "",
    thLastName: user.name.th.lastName,
    enPrefix: "",
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
    studentID: user.role == "student" ? user.studentID : "",
    citizenID: user.citizenID,
    birthDate: user.birthdate,
    email: "",
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
              label={t("profile.name.prefix.label", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thPrefix: e })}
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
              onChange={(e) => setForm({ ...form, thPrefix: e })}
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
            <KeyboardInput
              name="email"
              type="email"
              label={t("profile.general.email", { ns: "account" })}
              onChange={(e) => setForm({ ...form, email: e })}
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
            {user.role == "student" && (
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
          text="การเตรียมระบบให้นักเรียน"
        />
        <p className="text-tertiary">
          <strong>สำคัญ: ให้อาจารย์อ่านส่วนนี้ก่อนเข้าใช้งาน</strong>
        </p>
        <p>
          ผู้ดูแลระบบได้มอบหมายวิชาที่อาจารย์ต้องสอนแล้ว
          แต่ยังไม่ได้เชื่อมต่อห้องเรียนที่อาจารย์สอน
          หลังจากอาจารย์เสร็จขั้นตอนนี้แล้ว อาจารย์ต้องเตรียมระบบ MySK
          ในส่วนของท่านให้พร้อมสำหรับนักเรียน
        </p>
        <ol className="ml-6 list-decimal marker:font-display marker:text-outline">
          <li>เชื่อมต่อห้องเรียนที่อาจารย์สอน</li>
          <li>ในแต่ละวิชา ใส่รายละเอียดเฉพาะห้อง เช่น Google Classroom</li>
          <li>เพิ่มคาบสอนเข้าตารางสอนของอาจารย์</li>
        </ol>
      </Section>
    </motion.div>
  );
};

const DoneSection = ({ role }: { role: Role }): JSX.Element => {
  const { t } = useTranslation("landing");

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
          text="เข้าใช้งาน"
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
                alt=""
              />
            </div>
            <CardSupportingText>
              <p>
                ทุกอย่างพร้อมสำหรับการเข้าใช้งานระบบ MySK แล้ว
                หากมีปัญหาหรือข้อสงสัยใดๆ สามารถไปที่
                <a href="/help" target="mysk-help" className="link">
                  หน้าช่วยเหลือ
                </a>
                ได้
              </p>
            </CardSupportingText>
            <CardActions>
              <LinkButton
                label="เข้าใช้งาน"
                type="filled"
                url={role == "teacher" ? "/teach" : "/learn"}
                LinkElement={Link}
                className="w-full !text-center"
              />
            </CardActions>
          </Card>
        </LayoutGridCols>
      </Section>
    </motion.div>
  );
};

// Page
const Welcome: NextPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("landing");

  const [currStep, incrementStep] = useReducer((value) => value + 1, 0);

  // Dialog control
  const [showLogOut, toggleShowLogOut] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr("ยินดีต้อนรับ", t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: "ยินดีต้อนรับ" }}
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
              incrementStep={incrementStep}
              disabled={currStep >= 2}
            />
          )}
          <LayoutGridCols cols={2}>
            {currStep >= 2 && (
              <NewPasswordSection
                key="new-password-section"
                incrementStep={incrementStep}
                disabled={currStep >= 3}
              />
            )}
            {currStep >= 3 && (
              <>
                {user.role == "teacher" && (
                  <PreparingForStudentsSection key="preparing-for-students-section" />
                )}
                <DoneSection key="done-section" role={user.role} />
              </>
            )}
          </LayoutGridCols>
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

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "landing",
      ])),
      user,
    },
  };
};

export default Welcome;
