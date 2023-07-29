// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, ReactNode, forwardRef } from "react";

// SK Components
import {
  Card,
  CardContent,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Images
import LookupClassesDark from "@/public/images/graphics/lookup/class-dark.svg";
import LookupClassesLight from "@/public/images/graphics/lookup/class-light.svg";
import LookupDocumentsDark from "@/public/images/graphics/lookup/document-dark.svg";
import LookupDocumentsLight from "@/public/images/graphics/lookup/document-light.svg";
import LookupPeopleDark from "@/public/images/graphics/lookup/person-dark.svg";
import LookupPeopleLight from "@/public/images/graphics/lookup/person-light.svg";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const LookupCard: FC<{
  children?: ReactNode;
  id: string;
  image: JSX.Element;
  title: string;
  desc: string;
  className?: string;
}> = ({ children, id, image, title, desc, className }) => (
  <Card
    appearance="outlined"
    stateLayerEffect
    className={cn([
      `group !justify-end divide-y-1 divide-outline-variant sm:min-h-[9.25rem]`,
      className,
    ])}
    href={`/lookup/${id}`}
    // eslint-disable-next-line react/display-name
    element={forwardRef((props, ref) => (
      <Link
        aria-labelledby={`title-${id}`}
        aria-describedby={`desc-${id}`}
        {...{ ...props, ref }}
      />
    ))}
  >
    {/* Graphic */}
    <div className="aspect-[9/4] overflow-hidden bg-surface-1">{image}</div>

    {/* Count and other notes */}
    {children && (
      <div className="flex flex-col gap-1 bg-surface-2 px-4 py-3">
        {children}
      </div>
    )}

    <CardContent
      className="grow !flex-row items-center !gap-3
        bg-surface-5 sm:!flex-col sm:items-stretch"
    >
      <div className="flex flex-col gap-1">
        {/* Title */}
        <h2 id={`title-${id}`} className="skc-headline-small text-on-surface">
          {title}
        </h2>

        {/* Description */}
        <p id={`desc-${id}`}>{desc}</p>
      </div>
    </CardContent>
  </Card>
);

const LookupPage: CustomPage<{
  count: {
    [key in
      | "students"
      | "teachers"
      | "classes"
      | "orders"
      | "documents"]: number;
  };
}> = ({ count }) => {
  const locale = useLocale();
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
        <Columns columns={3} className="mx-4 !items-stretch sm:mx-0">
          {/* Lookup People */}
          <LookupCard
            id="person"
            image={
              <MultiSchemeImage
                srcLight={LookupPeopleLight}
                srcDark={LookupPeopleDark}
                alt=""
                priority
              />
            }
            title={t("people.title")}
            desc={t("people.desc")}
          >
            <p>
              {t("people.count", {
                students: count.students.toLocaleString(),
                teachers: count.teachers.toLocaleString(),
              })}
            </p>
          </LookupCard>

          {/* Lookup Classes */}
          <LookupCard
            id="class"
            image={
              <MultiSchemeImage
                srcLight={LookupClassesLight}
                srcDark={LookupClassesDark}
                alt=""
                priority
              />
            }
            title={t("classes.title")}
            desc={t("classes.desc")}
          >
            <p>
              {t("classes.count", { classes: count.classes.toLocaleString() })}
            </p>
          </LookupCard>

          {/* Lookup documents */}
          <LookupCard
            id="document"
            image={
              <MultiSchemeImage
                srcLight={LookupDocumentsLight}
                srcDark={LookupDocumentsDark}
                alt=""
                priority
              />
            }
            title={t("documents.title")}
            desc={t("documents.desc")}
          >
            <p>
              {t("documents.count", {
                orders: count.orders.toLocaleString(),
                // documents: count.documents.toLocaleString(),
                documents: "0",
              })}
            </p>
            {locale !== "th" && (
              <p>
                <strong>{t("documents.thaiOnly")}</strong>
              </p>
            )}
          </LookupCard>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Count the total number of students, teachers, classes, orders, and
  // documents in the database
  const { count: students } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true });
  const { count: teachers } = await supabase
    .from("teachers")
    .select("id", { count: "exact", head: true });
  const { count: classes } = await supabase
    .from("classrooms")
    .select("id", { count: "exact", head: true })
    .match({ year: getCurrentAcademicYear() });
  const { count: orders } = await supabase
    .from("school_documents")
    .select("id", { count: "exact", head: true })
    .match({ type: "order" });
  // const { count: documents } = await supabase
  //   .from("school_documents")
  //   .select("id", { count: "exact", head: true })
  //   .match({ type: "announcement" });

  const count = { students, teachers, classes, orders };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      count,
    },
    revalidate: 3600,
  };
};

export default LookupPage;
