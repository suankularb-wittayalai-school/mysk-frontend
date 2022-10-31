// External libraries
import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode } from "react";

// SK Components
import {
  Actions,
  LinkButton,
  MaterialIcon,
  Title,
} from "@suankularb-components/react";

// Animations
import { enterPageTransition } from "@utils/animations/config";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

// Hooks
import { useSession } from "@utils/hooks/auth";

// Types
import { LangCode } from "@utils/types/common";
import { FormPage, InfoPage } from "@utils/types/news";
import Head from "next/head";

const NewsPageWrapper = ({
  news,
  children,
}: {
  news: InfoPage | FormPage;
  children: ReactNode;
}) => {
  const locale = useRouter().locale as LangCode;
  const { t } = useTranslation("news");
  const session = useSession();

  return (
    // We’re not using ReSKComs in parts of this page here as it has poor
    // support for Framer Motion’s layout animations.
    <>
      <Head>
        <meta property="og:title" content={getLocaleString(news.content.title, locale)} />
        <meta property="og:type" content="news" />
        <meta property="og:url" content={`/news/info/${news.id}`} />
        <meta property="og:image" content={news.image} />
        <meta property="og:description" content={news.content.description[locale]} />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="MySK" />
      </Head>
      <main className="content-layout">
        <Title
          name={{
            title: getLocaleString(news.content.title, locale),
          }}
          pageIcon={<MaterialIcon icon="info" />}
          backGoesTo={session ? "/news" : "/"}
          LinkElement={Link}
        />
        <div className="content-layout__content !gap-y-0">
          {/* This part will animate from News Card and Landing Feed Item. */}
          <motion.section
            className="section"
            layoutId={["news", news.type, news.id].join("-")}
            transition={enterPageTransition}
          >
            {/* Banner image */}
            <div
              className="container-surface-variant relative aspect-video w-full
                overflow-hidden !p-0 text-right shadow sm:rounded-xl md:aspect-[5/1]"
            >
              {news.image ? (
                <Image src={news.image} layout="fill" objectFit="cover" alt="" />
              ) : (
                <p className="m-4 font-display text-8xl font-light leading-none opacity-30">
                  {getLocaleString(news.content.title, locale)}
                </p>
              )}
            </div>

            {/* Title and short description */}
            <div className="font-display">
              <motion.h1 className="text-4xl font-bold">
                {getLocaleString(news.content.title, locale)}
              </motion.h1>
              <motion.p className="text-lg">
                {getLocaleString(news.content.description, locale)}
              </motion.p>

              {session?.user?.user_metadata.isAdmin && (
                <Actions className="my-4">
                  <LinkButton
                    label={t("pageAction.admin.edit")}
                    type="tonal"
                    icon={<MaterialIcon icon="edit" />}
                    url={`/admin/news/edit/${news.type}/${news.id}`}
                    LinkElement={Link}
                  />
                </Actions>
              )}
            </div>
          </motion.section>

          {children}
        </div>
      </main>
    </>
  );
};

export default NewsPageWrapper;
