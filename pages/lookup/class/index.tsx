// Imports
import PageHeader from "@/components/common/PageHeader";
import ClassCard from "@/components/lookup/class/ClassCard";
import ClassSearchResult from "@/components/lookup/class/ClassSearchResult";
import getLookupClassrooms from "@/utils/backend/classroom/getLookupClassrooms";
import { range } from "@/utils/helpers/array";
import { createTitleStr } from "@/utils/helpers/title";
import { useLocale } from "@/utils/hooks/i18n";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Columns,
  ContentLayout,
  Header,
  List,
  Search,
  Section,
} from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";

const LookupClassesPage: CustomPage<{
  classrooms: (Pick<Classroom, "id" | "number" | "class_advisors"> & {
    studentCount: number;
  })[];
}> = ({ classrooms }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  // Form control
  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Head>
        <title>{createTitleStr(t("classes.title"), tx)}</title>
      </Head>
      <PageHeader title={t("classes.title")} parentURL="/lookup">
        <Columns columns={3} className="!w-[calc(100%-2rem)] sm:!w-full">
          <Search
            alt={t("classes.list.searchAlt")}
            value={query}
            locale={locale}
            onChange={setQuery}
            className="sm:col-span-2 md:col-span-1 md:col-start-2
              [&_li]:list-none"
          >
            <List>
              {classrooms
                // Since the entire database of classrooms is now stored on the
                // user’s device, we can just use filter and not incur any
                // database calls
                .filter((classroom) => String(classroom.number).includes(query))
                // Limit suggestions to 5
                .slice(0, 5)
                // Render the filterred list
                .map((classroom) => (
                  <ClassSearchResult key={classroom.id} classroom={classroom} />
                ))}
            </List>
          </Search>
        </Columns>
      </PageHeader>
      <ContentLayout>
        {/* The Classes list is separated by grade
            (i.e. the M.1 section contains M.101, M.102, ..., M.113) */}
        {
          // For a number from 1 to 6, render a Section representing a grade
          // (there are 6 grades in Suankularb)
          range(
            // Get the number of grades from getting the first digit of the
            // last class
            Math.floor((classrooms.slice(-1)[0]?.number || 0) / 100),
            1,
          ).map((grade) => (
            <Section key={grade}>
              <Header>{t("class", { ns: "common", number: grade })}</Header>
              <Columns columns={6} className="!items-stretch">
                {classrooms
                  // Filter for only classrooms in this grade
                  // For example, for M.1, the filter is `100 < number < 200`
                  .filter(
                    (classItem) =>
                      classItem.number > grade * 100 &&
                      classItem.number < (grade + 1) * 100,
                  )
                  // Render the Cards
                  .map((classItem) => (
                    <ClassCard key={classItem.id} classItem={classItem} />
                  ))}
              </Columns>
            </Section>
          ))
        }
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: classrooms } = await getLookupClassrooms(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      classrooms: classrooms!.sort((a, b) => a.number - b.number),
    },
    revalidate: 300,
  };
};

LookupClassesPage.childURLs = [
  "/account/welcome/your-subjects",
  "/account/welcome/logging-in",
];

export default LookupClassesPage;
