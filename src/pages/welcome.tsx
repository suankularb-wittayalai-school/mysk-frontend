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
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode } from "@utils/types/common";

// Sections
const HeroSection = ({
  incrementStep,
  toggleShowLogOut,
  disabled,
}: {
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
            alt="ลูกศรชี้เข้าโลโก้ MySK"
            width={142}
            height={96}
          />
        </div>
        <div className="gap-2 font-display">
          <h2 className="text-7xl leading-tight">ยินดีต้อนรับสู่ MySK</h2>
          <p className="text-3xl">
            ก่อนที่นักเรียนจะเริ่มใช้ระบบ MySK ได้
            ยังมีบางเรื่องที่ต้องจัดการก่อน
          </p>
        </div>
        <p>
          กรุณาตรวจสอบข้อมูลทุกอย่างให้ถูกต้องทุกกรณีก่อนที่จะกดไปขั้นตอนต่อไปทุกขั้นตอน
          เพราะข้อมูลบางส่วนอาจต้องผ่านกระบวนการแก้ไขที่ใช้เวลา
          หรืออาจไม่สามารถแก้ไขได้เลยในอนาคต หากข้อมูลผิดพลาด
        </p>
        <Actions>
          <Button
            label="ออกจากระบบ"
            type="outlined"
            icon={<MaterialIcon icon="logout" />}
            onClick={toggleShowLogOut}
            disabled={disabled}
            isDangerous
          />
          <Button
            label="ไปต่อ"
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
          text="ขั้นตอนต่อไป"
        />
        {[
          {
            icon: <MaterialIcon icon="badge" />,
            title: "ตรวจสอบข้อมูล",
            desc: "ระบบได้นำเข้าข้อมูลมาจากระบบอื่นๆ ของโรงเรียนแล้ว ในบางกรณี อาจมีข้อมูลที่ไม่ถูกต้องหรือตกหล่น สามารถแก้ไขได้ในขั้นตอนนี้",
          },
          {
            icon: <MaterialIcon icon="password" />,
            title: "สร้างรหัสผ่าน",
            desc: "เพื่อความปลอดภัยของข้อมูลโรงเรียน ให้สร้างรหัสผ่านที่ไม่ใช่วันเกิด",
          },
          {
            icon: <MaterialIcon icon="login" />,
            title: "เข้าใช้งาน",
            desc: "เริ่มใช้งานระบบ MySK",
          },
        ].map((step) => (
          <Card key={step.title} type="stacked" appearance="tonal">
            <CardHeader icon={step.icon} title={<h3>{step.title}</h3>} />
            <CardSupportingText>{step.desc}</CardSupportingText>
          </Card>
        ))}
      </Section>
    </LayoutGridCols>
  );
};

const DataCheckSection = ({
  incrementStep,
  disabled,
}: {
  incrementStep: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["landing", "account"]);

  // Form control
  const [form, setForm] = useState({
    thPrefix: "",
    thFirstName: "",
    thMiddleName: "",
    thLastName: "",
    enPrefix: "",
    enFirstName: "",
    enMiddleName: "",
    enLastName: "",
    studentID: "",
    citizenID: "",
    birthdate: "",
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
          text="ตรวจสอบข้อมูล"
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
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-middle-name"
              type="text"
              label={t("profile.name.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thMiddleName: e })}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-last-name"
              type="text"
              label={t("profile.name.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thLastName: e })}
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
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-middle-name"
              type="text"
              label={t("profile.enName.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enMiddleName: e })}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-last-name"
              type="text"
              label={t("profile.enName.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enLastName: e })}
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
            <KeyboardInput
              name="student-id"
              type="text"
              label={t("profile.role.studentID", { ns: "account" })}
              onChange={(e) => setForm({ ...form, studentID: e })}
              attr={{ disabled }}
            />
          </div>
        </section>

        <Actions>
          <Button
            label="บันทึกและไปต่อ"
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
          text="สร้างรหัสผ่าน"
        />

        <p>
          เพื่อความปลอดภัยของข้อมูลโรงเรียน ให้สร้างรหัสผ่านใหม่สำหรับระบบ MySK
          โดยการใส่รหัสผ่านใหม่สองครั้ง
        </p>

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
              onChange={(e: string) => setForm({ ...form, newPassword: e })}
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
              onChange={(e: string) =>
                setForm({ ...form, confirmNewPassword: e })
              }
              attr={{ minLength: 8, disabled }}
            />
          </div>
        </LayoutGridCols>

        <Actions>
          <Button
            label="สร้างและไปต่อ"
            type="filled"
            icon={<MaterialIcon icon="arrow_forward" />}
            onClick={incrementStep}
            disabled={disabled}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const DoneSection = (): JSX.Element => {
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
          icon={<MaterialIcon icon="login" allowCustomSize />}
          text="เข้าใช้งาน"
        />

        <LayoutGridCols cols={6}>
          <Card
            type="stacked"
            appearance="tonal"
            className="col-span-4 md:col-start-2"
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
                <a href="/help" className="link">
                  หน้าช่วยเหลือ
                </a>
                ได้
              </p>
            </CardSupportingText>
            <CardActions>
              <LinkButton
                label="เข้าใช้งาน"
                type="filled"
                url="/learn"
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
const Welcome: NextPage = () => {
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
            incrementStep={incrementStep}
            toggleShowLogOut={toggleShowLogOut}
            disabled={currStep >= 1}
          />
          {currStep >= 1 && (
            <DataCheckSection
              key="data-check-section"
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
            {currStep >= 3 && <DoneSection />}
          </LayoutGridCols>
        </AnimatePresence>
      </RegularLayout>
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "landing",
      ])),
    },
  };
};

export default Welcome;
