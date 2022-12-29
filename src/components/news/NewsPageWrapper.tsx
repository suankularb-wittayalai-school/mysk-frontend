// External libraries
import { motion } from "framer-motion";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode } from "react";

import { useUser } from "@supabase/auth-helpers-react";

// SK Components
import {
  FAB,
  LayoutGridCols,
  MaterialIcon,
  Section,
  Title,
} from "@suankularb-components/react";

// Animations
import { enterPageTransition } from "@utils/animations/config";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";
import { FormPage, InfoPage } from "@utils/types/news";

const NewsPageWrapper = ({
  news,
  children,
}: {
  news: InfoPage | FormPage;
  children: ReactNode;
}) => {
  const { t } = useTranslation("news");
  const router = useRouter();
  const locale = router.locale as LangCode;
  const user = useUser();

  return (
    // We’re not using ReSKComs in parts of this page here as it has poor
    // support for Framer Motion’s layout animations.
    <>
      <Head>
        <meta
          property="og:title"
          content={getLocaleString(news.content.title, locale)}
        />
        <meta property="og:type" content="news" />
        <meta
          property="og:url"
          content={`https://beta.mysk.school/news/info/${news.id}`}
        />
        <meta property="og:image" content={news.image} />
        <meta
          property="og:description"
          content={news.content.description[locale]}
        />
        <meta property="og:locale" content={locale} />
        <meta property="og:site_name" content="MySK" />
      </Head>
      <main className="content-layout">
        <Title
          name={{ title: t(`itemType.${news.type}`) }}
          pageIcon={<MaterialIcon icon="info" />}
          backGoesTo={user ? "/news" : "/"}
          LinkElement={Link}
        />
        <div className="content-layout__content !gap-y-0">
          {/* This part will animate from News Card and Landing Feed Item. */}
          <Section>
            <div className="layout-grid-cols-2 !flex !gap-y-6 !px-0 md:!grid">
              {/* Banner image */}
              <motion.div
                layoutId={["news", news.type, news.id].join("-")}
                className="container-surface-variant relative aspect-video w-full
                  overflow-hidden text-right shadow sm:rounded-xl"
                transition={enterPageTransition}
              >
                <Image
                  src={news.image || "/images/graphics/news-placeholder.png"}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                />
              </motion.div>

              {/* Title and short description */}
              <div className="mt-2 px-4 font-display sm:mt-0 sm:px-0">
                <h1 className="text-4xl font-bold leading-tight">
                  {getLocaleString(news.content.title, locale)}
                </h1>
                <p className="mt-4 text-lg">
                  {getLocaleString(news.content.description, locale)}
                </p>
              </div>
            </div>
          </Section>

          {children}
        </div>
      </main>

      {user?.user_metadata.isAdmin && (
        <FAB
          content={{ type: "normal", icon: <MaterialIcon icon="edit" /> }}
          onClick={() =>
            router.push(`/admin/news/edit/${news.type}/${news.id}`)
          }
        />
      )}
    </>
  );
};

export default NewsPageWrapper;
