import ClassDetailsCard from "@/components/classes/ClassDetailsCard";
import PersonAvatar from "@/components/common/PersonAvatar";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import cn from "@/utils/helpers/cn";
import useGetVCard from "@/utils/helpers/contact/useGetVCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import {
  AssistChip,
  ChipSet,
  DURATION,
  EASING,
  Header,
  MaterialIcon,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";

/**
 * The header of a Student/Teacher Details Card. Contains the name, avatar, and
 * actions.
 *
 * @param person The Person to display.
 * @param onScheduleOpenClick Callback to open the Person’s schedule.
 *
 * @param options Options to customize the Card.
 * @param options.noProfileLayout Whether to disable layout animation for the profile. Should be used if this is a child of a Dialog.
 * @param options.hideSeeClass Whether to hide the See class Chip.
 * @param options.hideScheduleCard Whether to hide the Student Schedule Card.
 */
const PersonHeader: StylableFC<{
  person: Student | Teacher;
  onScheduleOpenClick?: () => void;
  options?: Partial<{
    noProfileLayout: boolean;
    hideSeeClass: boolean;
    hideScheduleCard: boolean;
  }>;
}> = ({ person, onScheduleOpenClick, options, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation(
    {
      student: "search/students/header",
      teacher: "search/teachers/header",
    }[person.role],
  );

  const plausible = usePlausible();
  const getVCard = useGetVCard();

  /**
   * Save the Person’s contact as a vCard.
   */
  async function handleSaveVCard() {
    plausible("Save Person Contact", {
      props: { person: getLocaleName("en-US", person) },
    });
    var vCard = getVCard(person);
    window.location.href = URL.createObjectURL(vCard);
  }

  const classroomID = (
    person.role === "teacher" ? person.class_advisor_at : person.classroom
  )?.id;

  const supabase = useSupabaseClient();
  const [classOpen, setClassOpen] = useState(false);
  const [classroom, setClassroom] = useState<Omit<
    Classroom,
    "year" | "subjects"
  > | null>(null);

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
      transition={transition(DURATION.medium2, EASING.standard)}
      style={style}
      className={cn(
        `flex flex-col gap-6 p-4 md:grid md:grid-cols-[3.5rem,minmax(0,1fr)]`,
        className,
      )}
    >
      <PersonAvatar profile={person.profile} expandable size={64} />
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

          {!options?.hideSeeClass &&
            (person.role === UserRole.teacher
              ? person.class_advisor_at
              : person.role === UserRole.student && person.classroom) && (
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
                  <ClassDetailsCard
                    classroom={classroom}
                    refreshData={fetchClassOfPerson}
                  />
                </LookupDetailsDialog>
              </>
            )}

          {!options?.hideScheduleCard && (
            <AssistChip
              icon={<MaterialIcon icon="dashboard" />}
              onClick={() => {
                plausible("See Schedule of Person", {
                  props: { person: getLocaleName("en-US", person) },
                });
                onScheduleOpenClick?.();
              }}
            >
              {t("action.seeSchedule")}
            </AssistChip>
          )}
        </ChipSet>
      </div>
    </motion.div>
  );
};

export default PersonHeader;
