// External libraries
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useReducer } from "react";

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
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";

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
          เพราะข้อมูลบางส่วนอาจต้องผ่านกระบวนการ แก้ไขที่ใช้เวลา
          หรืออาจไม่สามารถแก้ไขได้เลยในอนาคตหากข้อมูลผิดพลาด
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
      <Section>
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
        <HeroSection
          incrementStep={incrementStep}
          toggleShowLogOut={toggleShowLogOut}
          disabled={currStep >= 1}
        />
        {currStep >= 1 && <section>TODO</section>}
      </RegularLayout>
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
