// External libraries
import Image from "next/image";
import { FC } from "react";

// SK Components
import { Avatar } from "@suankularb-components/react";

// Helpers
import startsWithThaiVowel from "@/utils/helpers/startsWithThaiVowel";

// Hooks
import useLocale from "@/utils/helpers/useLocale";

// Types
import { Person } from "@/utils/types/person";

const DynamicAvatar: FC<
  Partial<Pick<Person, "first_name" | "last_name" | "profile">> & { className?: string }
> = ({ first_name, last_name, profile, className }) => {
  // Translation
  const locale = useLocale();

  return (
    <Avatar {...{ className }}>
      {
        // Use profile image, if available
        profile ? (
          <Image src={profile} alt="" />
        ) : // Use the first letter of first name and last name, if available
        first_name && last_name ? (
          // Use English name, if available
          locale === "en-US" && first_name["en-US"] && last_name["en-US"] ? (
            [first_name["en-US"][0], last_name["en-US"][0]]
              .join("")
              .toUpperCase()
          ) : (
            // Otherwise, use Thai name
            [
              startsWithThaiVowel(first_name.th[0])
                ? first_name.th[1]
                : first_name.th[0],
              startsWithThaiVowel(last_name.th[0])
                ? last_name.th[1]
                : last_name.th[0],
            ].join("")
          )
        ) : // If nothing available, show the default vector
        undefined
      }
    </Avatar>
  );
};

export default DynamicAvatar;
