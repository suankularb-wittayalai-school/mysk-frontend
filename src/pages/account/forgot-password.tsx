// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FormEvent, useState } from "react";

// SK Components
import {
  Actions,
  FormButton,
  Header,
  KeyboardInput,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

const ForgotPassword: NextPage = () => {
  const { t } = useTranslation("account");

  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("forgor.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("forgor.title") }}
            pageIcon={<MaterialIcon icon="lock" />}
            backGoesTo="/account/login"
            LinkElement={Link}
          />
        }
      >
        <LayoutGridCols cols={3}>
          <div className="!p-0">
            <Image
              src="/images/graphics/password-reset.png"
              width={384}
              height={216}
              alt="Lock icon hanging on a thread"
              layout="responsive"
              className="sm:rounded-2xl"
            />
          </div>
          <Section>
            <Header
              icon={<MaterialIcon icon="password" allowCustomSize />}
              text={t("forgor.newPassword")}
            />
            <p>{t("forgor.supportingText")}</p>
            <form onSubmit={handleSubmit}>
              <KeyboardInput
                name="password"
                type="password"
                label={t("forgor.form.password")}
                useAutoMsg
                onChange={setPassword}
                attr={{ autoFocus: true }}
              />
              <Actions>
                <FormButton
                  label={t("forgor.action.use")}
                  type="submit"
                  appearance="filled"
                  disabled={!password}
                />
              </Actions>
            </form>
          </Section>
        </LayoutGridCols>
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
    },
  };
};

export default ForgotPassword;
