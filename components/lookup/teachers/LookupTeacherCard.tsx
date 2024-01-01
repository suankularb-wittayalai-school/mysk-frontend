// Imports
import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { TeacherLookupItem } from "@/utils/types/person";
import { Card, CardHeader } from "@suankularb-components/react";

const LookupTeacherCard: StylableFC<{
  teacher: TeacherLookupItem;
  selected?: string;
  onClick: (value: string) => void;
}> = ({ teacher, selected, onClick, style, className }) => {
  const locale = useLocale();

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => onClick(teacher.id)}
      style={style}
      className={cn(
        `w-full !rounded-none !border-transparent !bg-transparent text-left
        sm:!rounded-full`,
        teacher.id === selected &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:!text-on-primary-container sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        avatar={
          <PersonAvatar
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
