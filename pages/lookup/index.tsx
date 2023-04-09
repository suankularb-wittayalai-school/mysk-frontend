// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, forwardRef } from "react";

// SK Components
import {
  Card,
  CardContent,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

// Helpers
import { cn } from "@/utils/helpers/className";
import { createTitleStr } from "@/utils/helpers/title";

const LookupCard: FC<{
  id: string;
  icon: JSX.Element;
  text: string;
  recent?: string;
  className?: string;
}> = ({ id, icon, text, recent, className }) => (
  <Card
    appearance="filled"
    stateLayerEffect
    className={cn([
      `!justify-end border-1 border-outline-variant sm:min-h-[9.25rem]`,
      className,
    ])}
    href={`/lookup/${id}`}
    // eslint-disable-next-line react/display-name
    element={forwardRef((props, ref) => (
      <Link aria-labelledby={`header-${id}`} {...{ ...props, ref }} />
    ))}
  >
    <CardContent
      className="!flex-row items-center !gap-3 sm:!flex-col
        sm:items-stretch"
    >
      <div className="text-primary">{icon}</div>
      <div className="flex flex-col gap-1">
        <h1 id={`header-${id}`} className="skc-headline-small text-on-surface">
          {text}
        </h1>
        {recent && (
          <div className="item-center flex flex-row gap-1">
            <MaterialIcon icon="history" size={20} className="text-secondary" />
            <span className="skc-body-medium text-on-surface-variant">
              {recent}
            </span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const LookupPage: CustomPage = () => {
  const { t } = useTranslation(["lookup", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="search" />}
      />
      <ContentLayout>
        <Columns columns={2} className="mx-4 sm:mx-0 sm:!gap-y-6">
          <LookupCard
            id="people"
            icon={<MaterialIcon icon="badge" size={48} />}
            text={t("people.title")}
          />
          <LookupCard
            id="classes"
            icon={<MaterialIcon icon="groups" size={48} />}
            text={t("classes.title")}
          />
          <LookupCard
            id="orders"
            icon={<MaterialIcon icon="mail" size={48} />}
            text={t("orders.title")}
          />
          <LookupCard
            id="documents"
            icon={<MaterialIcon icon="description" size={48} />}
            text={t("documents.title")}
          />
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "lookup"]),
});

export default LookupPage;
