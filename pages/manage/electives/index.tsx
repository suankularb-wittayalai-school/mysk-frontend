import ElectiveDetailsCard from "@/components/elective/ElectiveDetailsCard";
import ElectiveLayout, {
  DIALOG_BREAKPOINTS,
} from "@/components/elective/ElectiveLayout";
import ElectiveListItem from "@/components/elective/ElectiveListItem";
import ElectiveStudentListCard from "@/components/elective/ElectiveStudentListCard";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useListDetail from "@/utils/helpers/search/useListDetail";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import {
  DURATION,
  EASING,
  Search,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * A place where the Management can view a list of all Elective Subjects and the
 * respective enrolled Students.
 *
 * @param electiveSubjects All Elective Subjects available this academic year.
 */
const ManageElectivesPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
}> = ({ electiveSubjects }) => {
  const { locale, locales } = useRouter() as {
    locale: LangCode;
    locales: LangCode[];
  };
  const { t } = useTranslation("elective");

  const plausible = usePlausible();
  const mysk = useMySKClient();

  // Filter the Elective Subjects by the search query.
  const [query, setQuery] = useState("");
  const filteredElectiveSubjects = electiveSubjects.filter(
    (electiveSubject) =>
      electiveSubject.session_code.includes(query) ||
      locales?.some(
        (locale) =>
          getLocaleString(electiveSubject.name, locale).includes(query) ||
          getLocaleString(electiveSubject.code, locale).includes(query),
      ),
  );
  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<ElectiveSubject>(
    filteredElectiveSubjects,
    (id) =>
      mysk.fetch<ElectiveSubject>(`/v1/subjects/electives/${id}`, {
        query: { fetch_level: "detailed", descendant_fetch_level: "default" },
      }),
    { firstByDefault: true, dialogBreakpoints: DIALOG_BREAKPOINTS },
  );

  return (
    <>
      <ElectiveLayout role={UserRole.management}>
        <section className="mx-4 -mb-9 flex flex-col">
          <Search
            alt={t("list.searchAlt")}
            value={query}
            locale={locale}
            onChange={setQuery}
          />
          <section
            className={cn(`fade-out-to-t fade-out-4 contents grow overflow-auto
              md:block`)}
          >
            <ul className="space-y-1.5 pt-4 md:h-0">
              {filteredElectiveSubjects.map((electiveSubject) => (
                <ElectiveListItem
                  key={electiveSubject.id}
                  role={UserRole.management}
                  electiveSubject={electiveSubject}
                  selected={selectedID === electiveSubject.id}
                  onClick={() => {
                    plausible("View Elective", {
                      props: {
                        subject: getLocaleString(electiveSubject.name, "en-US"),
                      },
                    });
                    onSelectedChange(electiveSubject.id);
                  }}
                />
              ))}
              <div aria-hidden className="h-28 sm:h-9" />
            </ul>
          </section>
        </section>

        {/* Details */}
        <motion.section
          key={selectedID || "empty"}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={transition(DURATION.medium2, EASING.standardDecelerate)}
          className="hidden flex-col gap-6 md:flex"
        >
          <main className="relative grow *:absolute *:inset-0">
            <ElectiveDetailsCard electiveSubject={selectedDetail} />
          </main>

          {/* Enrolled Students */}
          <div className="h-[18rem]">
            {selectedDetail && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition(
                  DURATION.medium2,
                  EASING.standardDecelerate,
                )}
                className="h-full"
              >
                <ElectiveStudentListCard
                  electiveSubject={selectedDetail}
                  className="h-full"
                />
              </motion.div>
            )}
          </div>
        </motion.section>
      </ElectiveLayout>

      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <ElectiveDetailsCard
          electiveSubject={selectedDetail}
          className={cn(`!mx-0 h-full !bg-surface-container-highest
            *:!rounded-b-none`)}
        />
      </LookupDetailsDialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const mysk = await createMySKClient();

  const { data: electiveSubjects } = await mysk.fetch<ElectiveSubject[]>(
    "/v1/subjects/electives",
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "compact",
        filter: {
          data: {
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
        sort: {
          by: [locale === "en-US" ? "name_en" : "name_th", "session_code"],
          ascending: true,
        },
      },
    },
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "elective",
      ])),
      electiveSubjects,
    },
    revalidate: 10,
  };
};

export default ManageElectivesPage;
