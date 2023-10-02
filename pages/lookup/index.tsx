// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import PageHeader from "@/components/common/PageHeader";
import LookupClassesDark from "@/public/images/graphics/lookup/class-dark.svg";
import LookupClassesLight from "@/public/images/graphics/lookup/class-light.svg";
import LookupDocumentsDark from "@/public/images/graphics/lookup/document-dark.svg";
import LookupDocumentsLight from "@/public/images/graphics/lookup/document-light.svg";
import LookupPeopleDark from "@/public/images/graphics/lookup/person-dark.svg";
import LookupPeopleLight from "@/public/images/graphics/lookup/person-light.svg";
import cn from "@/utils/helpers/cn";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { useLocale } from "@/utils/hooks/i18n";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Card,
  CardContent,
  Columns,
  ContentLayout,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { FC, ReactNode, forwardRef } from "react";

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
    className={cn(
      `group !justify-end divide-y-1 divide-outline-variant
      sm:min-h-[9.25rem]`,
      className,
    )}
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
      className={cn(`grow !flex-row items-center !gap-3 bg-surface-5
        sm:!flex-col sm:items-stretch`)}
    >
      <div className="flex flex-col gap-1">
        {/* Title */}
        <Text
          type="headline-small"
          element={(props) => <h4 id={`title-${id}`} {...props} />}
          className="text-on-surface"
        >
          {title}
        </Text>

        {/* Description */}
        <Text
          type="body-medium"
          element={(props) => <p id={`desc-${id}`} {...props} />}
        >
          {desc}
        </Text>
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
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
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
                documents: count.documents.toLocaleString(),
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
  const { count: documents } = await supabase
    .from("school_documents")
    .select("id", { count: "exact", head: true })
    .match({ type: "announcement" });

  const count = { students, teachers, classes, orders, documents };

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
