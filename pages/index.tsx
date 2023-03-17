// External libraries
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  Header,
  Section,
  TextField,
} from "@suankularb-components/react";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Page
const IndexPage: CustomPage = () => {
  // Router
  const locale = useLocale();
  const router = useRouter();

  // Translation
  const { t } = useTranslation(["landing", "account", "common"]);

  // Supabase
  const supabase = useSupabaseClient();
  
  // Form control
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  // Form submission
  const [loading, toggleLoading] = useToggle();

  function validate(): boolean {
    if (!email) return false;
    if (!password) return false;

    return true;
  }

  async function handleSubmit() {
    // Disable Log in Button
    withLoading(async () => {
      // Validate response
      if (!validate()) return false;

      // Log in user in Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: [email, "sk.ac.th"].join(""),
        password,
      });

      if (!session || error) return false;

      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        session.user.id
      );
      if (metadataError) return false;

      // Onboard the user if this is their first log in
      if (!metadata!.onboarded) router.push("/welcome");

      // Role redirect
      if (metadata!.role == "teacher") router.push("/teach");
      if (metadata!.role == "student") router.push("/learn");

      console.log("login successful");

      return true;
    }, toggleLoading);
  }

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <ContentLayout>
        <Columns columns={3} className="mx-4 sm:mx-0">
          <div className="col-span-2">
            <h1 className="skc-display-large mb-12">
              A year in the making. Rebuilt from the ground up.
            </h1>
            <Section>
              <Header className="!mb-4">Log in to MySK</Header>
              <Columns columns={2}>
                <div className="flex flex-col gap-10">
                  <TextField
                    appearance="outlined"
                    label={t("logIn.form.email", { ns: "account" })}
                    align="right"
                    trailing="sk.ac.th"
                    helperMsg={t("logIn.form.email_helper", { ns: "account" })}
                    error={email.endsWith("sk.ac.th")}
                    value={email}
                    onChange={(value) =>
                      setEmail(
                        (value as string).endsWith("sk.ac.th")
                          ? (value as string).slice(0, -8)
                          : (value as string)
                      )
                    }
                    locale={locale}
                  />
                  <TextField
                    appearance="outlined"
                    label={t("logIn.form.password", { ns: "account" })}
                    helperMsg={t("logIn.form.password_helper", {
                      ns: "account",
                    })}
                    value={password}
                    onChange={(value) => setPassword(value as string)}
                    locale={locale}
                    inputAttr={{ type: "password" }}
                  />
                  <Actions align={locale === "en-US" ? "right" : "full"}>
                    <Button appearance="outlined">
                      {t("logIn.action.forgotPassword", { ns: "account" })}
                    </Button>
                    <Button
                      appearance="filled"
                      loading={loading || undefined}
                      onClick={handleSubmit}
                    >
                      {t("logIn.action.logIn", { ns: "account" })}
                    </Button>
                  </Actions>
                </div>
              </Columns>
            </Section>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "account", "landing"])),
  },
});

export default IndexPage;
