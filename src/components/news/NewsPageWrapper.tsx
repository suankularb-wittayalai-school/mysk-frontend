// External libraries
import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode } from "react";

import { useUser } from "@supabase/auth-helpers-react";

// SK Components
import {
  Actions,
  FAB,
  FABLink,
  LinkButton,
  MaterialIcon,
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
  const router = useRouter();
  const locale = router.locale as LangCode;
  const { t } = useTranslation("news");
  const user = useUser();

  return (
    <>
      {/* We’re not using ReSKComs in parts of this page here as it has poor
          support for Framer Motion’s layout animations. */}
      <main className="content-layout">
        <Title
          name={{
            title: getLocaleString(news.content.title, locale),
          }}
          pageIcon={<MaterialIcon icon="info" />}
          backGoesTo={user ? "/news" : "/"}
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
                <Image
                  src={news.image}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                />
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
            </div>
          </motion.section>

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
