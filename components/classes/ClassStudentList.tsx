import LookupDetailsListCard from "@/components/lookup/LookupDetailsListCard";
import PersonCard from "@/components/person/PersonCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import cn from "@/utils/helpers/cn";
import useGetVCard from "@/utils/helpers/contact/useGetVCard";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Button, MaterialIcon, Text } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";

/**
 * The list of Students inside Class Details Card.
 *
 * @param students The list of Students to display.
 * @param classroom The Classroom to display the Students for.
 */
const ClassStudentList: StylableFC<{
  students: Classroom["students"];
  classroom: Pick<Classroom, "id" | "number">;
}> = ({ students, classroom, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "detail.students" });

  const plausible = usePlausible();
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const [loading, toggleLoading] = useToggle();
  const getVCard = useGetVCard();

  /**
   * Save all Students’ vCards as a single file.
   */
  async function handleSaveVCard() {
    withLoading(
      async () => {
        const { data, error } = await getStudentsByIDs(
          supabase,
          mysk,
          students.map((student) => student.id),
          { detailed: true, includeChosenElective: true },
        );
        if (error) return false;

        // Get all vCards and merge them into a single file
        const vCards = data.map((student) => getVCard(student));
        var mergedVCard = new Blob(
          [
            (
              await Promise.all(vCards.map(async (vCard) => await vCard.text()))
            ).join("\n"),
          ],
          { type: "text/vcard;charset=utf-8" },
        );

        // Download the file
        window.location.href = URL.createObjectURL(mergedVCard);

        plausible("Save vCards of Students in Classroom", {
          props: { number: `M.${classroom.number}` },
        });
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <LookupDetailsListCard
      title={
        <>
          <Text type="title-medium" className="grow">
            {t("title")}
          </Text>
          <Button
            appearance="text"
            icon={<MaterialIcon icon="download" />}
            loading={loading}
            onClick={handleSaveVCard}
            className="!-m-2"
          >
            {t("action.saveAll")}
          </Button>
        </>
      }
      style={style}
      className={className}
    >
      {students.map((student) => (
        <PersonCard
          key={student.id}
          person={{ ...student, classroom, role: UserRole.student }}
          options={{
            hideClassroomInSubtitle: true,
            showNicknameInSubtitle: true,
            hideSeeClass: true,
          }}
          element="li"
          className={cn(`cursor-pointer !border-0 hover:m-[-1px] hover:!border-1
            focus:m-[-1px] focus:!border-1`)}
        />
      ))}
    </LookupDetailsListCard>
  );
};

export default ClassStudentList;
