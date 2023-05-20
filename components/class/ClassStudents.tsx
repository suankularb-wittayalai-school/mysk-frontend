// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import va from "@vercel/analytics";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  SplitLayout,
  useBreakpoint,
} from "@suankularb-components/react";

// Internal components
import ClassStudentCard from "@/components/class/ClassStudentCard";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
import {
  getFullStudentsFromIDs,
  getStudent,
} from "@/utils/backend/person/student";

// Helpers
import { useGetVCard } from "@/utils/helpers/contact";
import { withLoading } from "@/utils/helpers/loading";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { Student } from "@/utils/types/person";

const ClassStudents: FC<{
  studentList: Student[];
  classNumber?: number;
}> = ({ studentList, classNumber }) => {
  const { t } = useTranslation("class", { keyPrefix: "student.list" });

  const { atBreakpoint } = useBreakpoint();
  const router = useRouter();

  // Selected Person
  const [selected, setSelected] = useState(studentList[0]?.id);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedStudent, setSelectedStudent] = useState<Student>();
  useEffect(() => {
    if (
      !selected ||
      selected === selectedStudent?.id ||
      atBreakpoint === "base"
    )
      return;

    withLoading(
      async () => {
        const { data, error } = await getStudent(supabase, selected);
        if (error) return false;

        setSelectedStudent(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [selected, atBreakpoint === "base"]);

  // Query
  const [query, setQuery] = useState<string>("");

  // VCard
  const getVCard = useGetVCard();
  const [vCardLoading, toggleVCardLoading] = useToggle();
  async function handleSaveVCard() {
    withLoading(
      async () => {
        const { data, error } = await getFullStudentsFromIDs(
          supabase,
          studentList.map((student) => student.id)
        );
        if (error) return false;

        const vCards = data.map((student) => getVCard(student));
        var mergedVCard = new Blob(
          [
            (
              await Promise.all(vCards.map(async (vCard) => await vCard.text()))
            ).join("\n"),
          ],
          { type: "text/vcard;charset=utf-8" }
        );

        window.location.href = URL.createObjectURL(mergedVCard);
        va.track("Save Class VCards", { number: `M.${classNumber}` });
        return true;
      },
      toggleVCardLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <SplitLayout
      ratio="list-detail"
      className="sm:[&>*>*]:!h-[calc(100vh-14.75rem-1px)]
        supports-[height:100dvh]:sm:[&>*>*]:!h-[calc(100dvh-14.75rem-1px)]"
    >
      <LookupList
        length={studentList.length}
        searchAlt={t("searchAlt")}
        actions={
          <Actions className="-mt-3 mb-4 !grid grid-cols-1 md:!grid-cols-[2fr,3fr]">
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="print" />}
              href={`${router.asPath}/print`}
              element={Link}
            >
              {t("action.print")}
            </Button>
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="contact_page" />}
              onClick={handleSaveVCard}
              loading={vCardLoading || undefined}
            >
              {t("action.saveVCards")}
            </Button>
          </Actions>
        }
        query={query}
        onQueryChange={setQuery}
        liveFilter
      >
        {studentList
          .filter(
            (student) =>
              String(student.classNo).includes(query) ||
              nameJoiner("th", student.name)
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              nameJoiner("en-US", student.name)
                .toLowerCase()
                .includes(query.toLowerCase())
          )
          .map((student) => (
            <ClassStudentCard
              key={student.id}
              seperated={query === ""}
              student={student}
              classNumber={classNumber}
              selectedID={selected}
              setSelectedID={setSelected}
            />
          ))}
      </LookupList>
      {selected ? (
        <PersonDetails
          person={selectedStudent}
          suggestionsType="share-only"
          loading={loading}
        />
      ) : (
        <EmptyDetail />
      )}
    </SplitLayout>
  );
};

export default ClassStudents;
