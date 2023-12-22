import ClassStudentListItem from "@/components/classes/ClassStudentListItem";
import LookupDetailsListCard from "@/components/lookup/LookupDetailsListCard";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import { useGetVCard } from "@/utils/helpers/contact";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Button, MaterialIcon, Text } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";

/**
 * The list of Students inside Class Details Card.
 *
 * @param students The list of Students to display.
 * @param classNumber The 3-digit number of the Classroom.
 */
const ClassStudentList: StylableFC<{
  students: Classroom["students"];
  classNumber: number;
}> = ({ students, classNumber, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail.students" });

  const supabase = useSupabaseClient();

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
          students.map((student) => student.id),
          { detailed: true },
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

        va.track("Save Class VCards", { number: `M.${classNumber}` });
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
        <ClassStudentListItem key={student.id} student={student} />
      ))}
    </LookupDetailsListCard>
  );
};

export default ClassStudentList;
