// Imports
import ClassStudentCard from "@/components/class/ClassStudentCard";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import PersonDetails from "@/components/lookup/person/PersonDetails";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import cn from "@/utils/helpers/cn";
import { useGetVCard } from "@/utils/helpers/contact";
import { withLoading } from "@/utils/helpers/loading";
import { getLocaleName } from "@/utils/helpers/string";
import { useToggle } from "@/utils/hooks/toggle";
import { Student } from "@/utils/types/person";
import {
  Actions,
  Button,
  MaterialIcon,
  SplitLayout,
  useBreakpoint,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const ClassStudents: FC<{
  studentList: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "class_no"
  >[];
  classNumber?: number;
  isOwnClass?: boolean;
}> = ({ studentList, classNumber, isOwnClass }) => {
  const { t } = useTranslation("class", { keyPrefix: "student.list" });

  const { atBreakpoint } = useBreakpoint();
  const router = useRouter();

  // Selected Person
  const [selected, setSelected] = useState(studentList[0]?.id);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  useEffect(() => {
    if (
      !selected ||
      selected === selectedStudent?.id ||
      atBreakpoint === "base"
    )
      return;

    withLoading(
      async () => {
        const { data, error } = await getStudentByID(supabase, selected, {
          detailed: true,
          includeContacts: isOwnClass,
        });
        if (error) return false;
        setSelectedStudent(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
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
        const { data, error } = await getStudentsByIDs(
          supabase,
          studentList.map((student) => student.id),
          { detailed: true },
        );
        if (error) return false;

        const vCards = data.map((student) => getVCard(student));
        var mergedVCard = new Blob(
          [
            (
              await Promise.all(vCards.map(async (vCard) => await vCard.text()))
            ).join("\n"),
          ],
          { type: "text/vcard;charset=utf-8" },
        );

        window.location.href = URL.createObjectURL(mergedVCard);
        va.track("Save Class VCards", { number: `M.${classNumber}` });
        return true;
      },
      toggleVCardLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <SplitLayout
      ratio="list-detail"
      className="sm:[&>*>*]:!h-[calc(100dvh-8.25rem-1px)]"
    >
      <LookupList
        length={studentList.length}
        searchAlt={t("searchAlt")}
        actions={
          <Actions
            className={cn(`-mt-3 mb-4 !grid grid-cols-1
              md:!grid-cols-[1fr,2fr]`)}
          >
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
              String(student.class_no).includes(query) ||
              getLocaleName("th", student)
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              getLocaleName("en-US", student)
                .toLowerCase()
                .includes(query.toLowerCase()),
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
      {selectedStudent ? (
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
