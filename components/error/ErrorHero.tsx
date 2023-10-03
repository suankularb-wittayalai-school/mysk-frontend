// Imports
import { Columns, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { FC, ReactNode } from "react";

const ErrorHero: FC<{
  children?: ReactNode;
  image?: JSX.Element;
  title: string;
  code?: number;
  verbose?: string;
  tabName?: string;
}> = ({ children, image, title, code, verbose, tabName }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("tabName", { tabName: tabName || title })}</title>
      </Head>
      <Columns columns={2}>
        {image}
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <Text type="headline-large" element="h1">
              {title}
            </Text>
            {(code || verbose) && (
              <Text type="title-large" className="text-on-surface-variant">
                {[code, verbose].filter((segment) => segment).join(": ")}
              </Text>
            )}
          </header>
          {children}
        </div>
      </Columns>
    </>
  );
};

export default ErrorHero;
