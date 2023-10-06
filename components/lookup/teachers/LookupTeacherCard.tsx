// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { TeacherLookupItem } from "@/utils/types/person";
import {
  Card,
  CardHeader,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const LookupTeacherCard: FC<{
  teacher: TeacherLookupItem;
  selected?: string;
  setSelected: (value: string) => void;
}> = ({ teacher, selected, setSelected }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => setSelected(teacher.id)}
      className={cn(
        `w-full !border-transparent !bg-transparent text-left`,
        teacher.id === selected &&
          `sm:!border-outline-variant sm:!bg-primary-container sm:!text-on-primary-container
            sm:focus:!border-primary`,
      )}
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            // name={person.name}
            first_name={teacher.first_name}
            last_name={teacher.last_name}
            className={
              teacher.id === selected
                ? `sm:!bg-primary sm:!text-on-primary`
                : undefined
            }
          />
        }
        title={getLocaleName(locale, teacher, { prefix: "teacher" })}
        subtitle={
          teacher.subject_group
            ? getLocaleString(teacher.subject_group.name, locale)
            : undefined
        }
      />
    </Card>
  );
};

export default LookupTeacherCard;
