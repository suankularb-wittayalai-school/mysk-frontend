import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Student, Teacher } from "@/utils/types/person";
import { Text } from "@suankularb-components/react";
import { title } from "radash";

/**
 * A Person’s profile picture, name, and role.
 *
 * @param person The Person to display the information of.
 */
const AboutPersonSummary: StylableFC<{
  person: Pick<
    Student | Teacher,
    "role" | "profile" | "first_name" | "last_name" | "middle_name"
  >;
}> = ({ person, style, className }) => {
  const locale = useLocale();

  return (
    <div
      style={style}
      className={cn(`grid grid-cols-[4rem,1fr] gap-3`, className)}
    >
      <PersonAvatar
        profile={person.profile}
        expandable
        className={cn(
          person.profile
            ? `[&>div]:!h-16 [&>div]:!w-16 [&>div]:border-1
              [&>div]:border-outline-variant`
            : `!h-16 !w-16`,
        )}
      />
      <div>
        <Text type="title-large" element="h3">
          {getLocaleName(locale, person, {
            prefix: person.role === "teacher" ? "teacher" : false,
          })}
        </Text>
        <Text
          type="title-small"
          element="p"
          // `ml-0.5` helps optically align the text
          // (the Avatar on the left is circular).
          className="ml-0.5 text-on-surface-variant"
        >
          {title(person.role)}
        </Text>
      </div>
    </div>
  );
};

export default AboutPersonSummary;
