import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";
import { getAllInfoIDs, getInfo } from "@utils/backend/news/info";
import { getLocaleString } from "@utils/helpers/i18n";
import { useSession } from "@utils/hooks/auth";
import { LangCode } from "@utils/types/common";
import { NewsItemInfoNoDate } from "@utils/types/news";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

const InfoPage: NextPage<{ info: NewsItemInfoNoDate }> = ({ info }) => {
  const locale = useRouter().locale as LangCode;
  const session = useSession();

  return (
    <RegularLayout
      Title={
        <Title
          name={{
            title: getLocaleString(info.content.title, locale),
            subtitle: "บทความ",
          }}
          pageIcon={<MaterialIcon icon="info" />}
          backGoesTo={session ? "/news" : "/"}
          LinkElement={Link}
        />
      }
    >
      <div
        className="container-surface-variant relative aspect-video w-full p-2 text-right shadow
          sm:aspect-[5/1] sm:rounded-xl"
      >
        {info.image ? (
          <Image src={info.image} layout="fill" objectFit="cover" alt="" />
        ) : (
          <span className="font-display text-8xl font-light leading-none opacity-30">
            {getLocaleString(info.content.title, locale)}
          </span>
        )}
      </div>
      <Section className="font-display">
        <h1 className="text-4xl font-bold leading-none">
          {getLocaleString(info.content.title, locale)}
        </h1>
        <p className="text-lg">
          {getLocaleString(info.content.description, locale)}
        </p>
        {info.content.body && (
          <ReactMarkdown remarkPlugins={[gfm]} className="markdown">
            {getLocaleString(info.content.body, locale)}
          </ReactMarkdown>
        )}
      </Section>
    </RegularLayout>
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
