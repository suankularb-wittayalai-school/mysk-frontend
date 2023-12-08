// Imports
import ClassDetailsCard from "@/components/classes/ClassDetailsCard";
import DynamicAvatar from "@/components/common/DynamicAvatar";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import cn from "@/utils/helpers/cn";
import { useGetVCard } from "@/utils/helpers/contact";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import useUser from "@/utils/helpers/useUser";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  Header,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

/**
 * The header of a Student/Teacher Details Card. Contains the name, avatar, and
 * actions.
 *
 * @param person The Person to display.
 * @param onScheduleOpenClick Callback to open the Person’s schedule.
 */
const PersonHeader: StylableFC<{
  person: Student | Teacher;
  onScheduleOpenClick: () => void;
}> = ({ person, onScheduleOpenClick, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "people.header" });

  const { duration, easing } = useAnimationConfig();

  const getVCard = useGetVCard();
  const { user } = useUser();

  /**
   * Save the Person’s contact as a vCard.
   */
  async function handleSaveVCard() {
    va.track("Share Person", {
      person: getLocaleName("en-US", person),
      method: "vCard",
    });
    var vCard = getVCard(person);
    window.location.href = URL.createObjectURL(vCard);
  }

  const classroomID = (
    person.role === "teacher" ? person.class_advisor_at : person.classroom
  )?.id;

  const supabase = useSupabaseClient();
  const [classOpen, setClassOpen] = useState(false);
  const [classroom, setClassroom] =
    useState<Omit<Classroom, "year" | "subjects">>();

  /**
   * Fetch the Person’s Classroom.
   */
  async function fetchClassOfPerson() {
    if (!classroomID) return;
    const { data, error } = await getClassroomByID(supabase, classroomID);
    if (!error) setClassroom(data);
  }
  useEffect(() => {
    if (!classOpen || classroom) return;
    fetchClassOfPerson();
  }, [classOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(
        `flex flex-col gap-6 p-4 md:grid md:grid-cols-[3.5rem,minmax(0,1fr)]`,
        className,
      )}
    >
      <DynamicAvatar profile={person.profile} className="!h-14 !w-14" />
      <div className="flex flex-col gap-4 md:gap-2">
        <Header
          element={(props) => <h2 id="header-person-details" {...props} />}
        >
          {getLocaleName(
            locale,
            person,
            person.role === "teacher" ? { prefix: "teacher" } : undefined,
          )}
        </Header>
        <ChipSet
          scrollable
          className="-mx-4 !overflow-auto px-4 md:ml-0 md:pl-0"
        >
          <AssistChip
            icon={<MaterialIcon icon="download" />}
            onClick={handleSaveVCard}
          >
            {t("action.saveContact")}
          </AssistChip>

          {(person.role === "teacher"
            ? person.class_advisor_at
            : person.role === "student" && person.classroom) && (
            <>
              <AssistChip
                icon={<MaterialIcon icon="groups" />}
                onClick={() => setClassOpen(true)}
              >
                {t("action.seeClass")}
              </AssistChip>
              <LookupDetailsDialog
                open={classOpen}
                onClose={() => setClassOpen(false)}
              >
                {user && (
                  <ClassDetailsCard
                    classroom={classroom}
                    isOwnClass={false}
                    user={user}
                    refreshData={fetchClassOfPerson}
                  />
                )}
              </LookupDetailsDialog>
            </>
          )}

          <AssistChip
            icon={<MaterialIcon icon="dashboard" />}
            onClick={() => {
              va.track("See Schedule of Person", {
                person: getLocaleName("en-US", person),
              });
              onScheduleOpenClick();
            }}
          >
            {t(`action.seeSchedule.${person.role}`)}
          </AssistChip>
        </ChipSet>
      </div>
    </motion.div>
  );
};

export default PersonHeader;
