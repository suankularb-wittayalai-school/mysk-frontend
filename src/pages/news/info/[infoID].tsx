// Modules
import { motion } from "framer-motion";

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Actions,
  LinkButton,
  MaterialIcon,
  NoticebarManager,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import Markdown from "@components/Markdown";

// Animations
import { enterPageTransition } from "@utils/animations/config";

// Backend
import { getAllInfoIDs, getInfo } from "@utils/backend/news/info";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

// Hookes
import { useSession } from "@utils/hooks/auth";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemInfoNoDate } from "@utils/types/news";

const InfoPage: NextPage<{ info: NewsItemInfoNoDate }> = ({ info }) => {
  const locale = useRouter().locale as LangCode;
  const session = useSession();

  return (
    // We’re not using ReSKComs in parts of this page here as it has poor support for
    // Framer Motion’s layout animations.
    <main className="content-layout">
      <Title
        name={{
          title: getLocaleString(info.content.title, locale),
        }}
        pageIcon={<MaterialIcon icon="info" />}
        backGoesTo={session ? "/news" : "/"}
        LinkElement={Link}
      />
      <div className="content-layout__content !gap-y-0">
        {locale == "en-US" &&
          !(
            info.content.title["en-US"] &&
            info.content.description["en-US"] &&
            info.content.body?.["en-US"]
          ) && (
            <Section className="mb-8">
              {/* Notify the user that the page is not translated.
              This part is not translated because only English language users will
              see this.
            */}
              <NoticebarManager
                id="info-ntb"
                noticebars={[
                  {
                    id: "no-translation",
                    type: "info",
                    icon: <MaterialIcon icon="translate" />,
                    message:
                      "This article has incomplete to no English translation. We aplogize for the inconvenience.",
                    actions: [],
                  },
                ]}
              />
            </Section>
          )}

        {/* This part will animate from News Card/Landing Feed Item. */}
        <motion.section
          className="section"
          layoutId={`news-info-${info.id}`}
          transition={enterPageTransition}
        >
          {/* Banner image */}
          <div
            className="container-surface-variant relative aspect-video w-full
              overflow-hidden text-right shadow sm:rounded-xl md:aspect-[5/1]"
          >
            {info.image ? (
              <Image src={info.image} layout="fill" objectFit="cover" alt="" />
            ) : (
              <p className="m-4 !p-0 font-display text-8xl font-light leading-none opacity-30">
                {getLocaleString(info.content.title, locale)}
              </p>
            )}
          </div>

          {/* Title and short description */}
          <div className="font-display">
            <motion.h1 className="text-4xl font-bold">
              {getLocaleString(info.content.title, locale)}
            </motion.h1>
            <motion.p className="text-lg">
              {getLocaleString(info.content.description, locale)}
            </motion.p>

            {session?.user?.user_metadata.isAdmin && (
              <Actions className="my-2">
                <LinkButton
                  label="Edit article"
                  type="tonal"
                  icon={<MaterialIcon icon="edit" />}
                  url={`/t/admin/news/edit/info/${info.id}`}
                  LinkElement={Link}
                />
              </Actions>
            )}
          </div>
        </motion.section>

        {/* Main content (formatted Markdown) */}
        <section>
          {info.content.body && (
            <Markdown>{getLocaleString(info.content.body, locale)}</Markdown>
          )}
        </section>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const info = await getInfo(Number(params?.infoID));
  if (!info) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "schedule",
      ])),
      revalidate: 300,
      info,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllInfoIDs()).map((number) => ({
      params: { infoID: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default InfoPage;
