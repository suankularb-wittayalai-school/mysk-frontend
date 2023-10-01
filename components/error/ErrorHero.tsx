// Imports
import { Columns } from "@suankularb-components/react";
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
            <h1 className="skc-headline-large">{title}</h1>
            {(code || verbose) && (
              <p className="skc-title-large text-on-surface-variant">
                {[code, verbose].filter((segment) => segment).join(": ")}
              </p>
            )}
          </header>
          {children}
        </div>
      </Columns>
    </>
  );
};

export default ErrorHero;
