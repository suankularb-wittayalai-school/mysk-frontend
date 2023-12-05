import LookupDetailsListCard from "@/components/lookup/LookupDetailsListCard";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import { useGetVCard } from "@/utils/helpers/contact";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Avatar,
  Button,
  ListItem,
  ListItemContent,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { sift } from "radash";

const ClassStudentList: StylableFC<{
  students: Classroom["students"];
  classNumber: number;
}> = ({ students, classNumber, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "detail.students" });

  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();
  const getVCard = useGetVCard();

  async function handleSaveVCard() {
    withLoading(
      async () => {
        const { data, error } = await getStudentsByIDs(
          supabase,
          students.map((student) => student.id),
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
        <ListItem key={student.id} align="center" lines={2}>
          {/* Profile */}
          <Avatar>
            {student.profile && <Image src={student.profile} alt="" />}
          </Avatar>
          <ListItemContent
            // Full name
            title={getLocaleName(locale, student)}
            desc={sift([
              // Class no.
              t("item.classNo", { classNo: student.class_no }),
              // Nickname
              (student.nickname?.th || student.nickname?.["en-US"]) &&
                `${getLocaleString(student.nickname, locale)}`,
            ]).join(" • ")}
          />
        </ListItem>
      ))}
    </LookupDetailsListCard>
  );
};

export default ClassStudentList;
