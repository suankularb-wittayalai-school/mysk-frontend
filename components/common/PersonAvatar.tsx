// Imports
import startsWithThaiVowel from "@/utils/helpers/startsWithThaiVowel";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import { Avatar } from "@suankularb-components/react";
import Image from "next/image";

const PersonAvatar: StylableFC<
  Partial<Pick<Person, "first_name" | "last_name" | "profile">>
> = ({ first_name, last_name, profile, style, className }) => {
  const locale = useLocale();

  return (
    <Avatar style={style} className={className}>
      {
        // Use profile image, if available
        profile ? (
          <Image src={profile} alt="" width={48} height={48} />
        ) : // Use the first letter of first name and last name, if available
        first_name && last_name ? (
          // Use English name, if available
          locale === "en-US" && first_name["en-US"] && last_name["en-US"] ? (
            [first_name["en-US"][0], last_name["en-US"][0]]
              .join("")
              .toUpperCase()
          ) : // Otherwise, use Thai name
          startsWithThaiVowel(first_name.th[0]) ? (
            first_name.th[1]
          ) : (
            first_name.th[0]
          )
        ) : // If nothing available, show the default vector
        undefined
      }
    </Avatar>
  );
};

export default PersonAvatar;
