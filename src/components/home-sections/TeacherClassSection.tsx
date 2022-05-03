// Modules
import { isThisYear } from "date-fns";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { useEffect, useState } from "react";

// SK Components
import {
  ChipFilterList,
  Header,
  MaterialIcon,
  Section,
  XScrollContent,
  LinkButton,
  Card,
  CardHeader,
} from "@suankularb-components/react";

// Types
import { StudentForm } from "@utils/types/news";

const StudentFormCard = ({ form }: { form: StudentForm }): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation("news");

  return (
    <Card type="horizontal">
      <CardHeader
        // Title
        title={
          <h3 className="text-lg font-bold break-all">
            {form.content[locale]?.title || form.content.th.title}
          </h3>
        }
        // Type and post date
        label={
          <div className="flex divide-x divide-outline">
            <span className="pr-2">{t(`itemType.${form.type}`)}</span>
            <time className="pl-2 text-outline">
              {form.postDate.toLocaleDateString(locale, {
                year: isThisYear(form.postDate) ? undefined : "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        }
        // Completion and link
        end={
          <div className="flex flex-row items-center gap-2">
            <div
              className={`rounded-lg py-2 px-3 font-sans font-bold ${
                form.percentDone < 25
                  ? "error"
                  : form.percentDone < 50
                  ? "container-tertiary"
                  : "container-primary"
              }`}
            >
              {form.percentDone}%
            </div>
            <LinkButton
              name={t("action.seeDetails")}
              type="tonal"
              iconOnly
              icon={<MaterialIcon icon="arrow_forward" />}
              url={`/t/${form.type}/${form.id}`}
              LinkElement={Link}
            />
          </div>
        }
        className="font-display"
      />
    </Card>
  );
};

const TeacherClassSection = ({
  studentForms: forms,
}: {
  studentForms: Array<StudentForm>;
}): JSX.Element => {
  const { t } = useTranslation(["dashboard", "news"]);
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<Array<StudentForm>>(forms);

  useEffect(
    () => {
      // Reset filtered news if all filters are deselected
      if (newsFilter.length == 0) {
        setFilteredNews(forms);
      
      // Handles done
      } else if (
        newsFilter.includes("few-done") ||
        newsFilter.includes("most-done") ||
        newsFilter.includes("all-done")
      ) {
        if (newsFilter.length > 1) {
          setFilteredNews(
            forms.filter(
              (newsItem) =>
                newsFilter.includes(newsItem.type) &&
                (newsFilter.includes("few-done")
                  ? newsItem.percentDone < 25
                  : newsFilter.includes("most-done")
                  ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                  : newsFilter.includes("all-done") &&
                    newsItem.percentDone >= 50)
            )
          );
        } else {
          setFilteredNews(
            forms.filter((newsItem) =>
              newsFilter.includes("few-done")
                ? newsItem.percentDone < 25
                : newsFilter.includes("most-done")
                ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                : newsFilter.includes("all-done") && newsItem.percentDone >= 50
            )
          );
        }
      }

      // Handles types
      else {
        setFilteredNews(
          forms.filter((newsItem) => newsFilter.includes(newsItem.type))
        );
      }
    },

    // Adding `forms` as a dependency causes an inifinie loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsFilter]
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="groups" allowCustomSize={true} />}
        text={t("class.title")}
      />
      <ChipFilterList
        choices={[
          { id: "form", name: t("news.filter.forms") },
          { id: "payment", name: t("news.filter.payments") },
          [
            { id: "few-done", name: t("news.filter.amountDone.fewDone") },
            { id: "most-done", name: t("news.filter.amountDone.mostDone") },
            { id: "all-done", name: t("news.filter.amountDone.allDone") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
        scrollable={true}
      />
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li
            className="grid h-[4.8125rem] place-content-center rounded-xl
              bg-surface-1 text-center text-on-surface"
          >
            {t("class.noRelevantForms")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((form) => (
            <li key={form.id}>
              <StudentFormCard form={form} />
            </li>
          ))}
        </XScrollContent>
      )}
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("class.action.seeClassDetail")}
          type="filled"
          url="/t/509/class"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

export default TeacherClassSection;
