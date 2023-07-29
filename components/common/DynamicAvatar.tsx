// External libraries
import Image from "next/image";
import { FC } from "react";

// SK Components
import { Avatar } from "@suankularb-components/react";

// Helpers
import { startsWithThaiVowel } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Person } from "@/utils/types/person";

const DynamicAvatar: FC<
  Partial<Pick<Person, "name" | "profile">> & { className?: string }
> = ({ name, profile, className }) => {
  // Translation
  const locale = useLocale();

  return (
    <Avatar {...{ className }}>
      {
        // Use profile image, if available
        profile ? (
          <Image src={profile} alt="" />
        ) : // Use the first letter of first name and last name, if available
        name ? (
          // Use English name, if available
          locale === "en-US" && name["en-US"] ? (
            [name["en-US"].firstName[0], name["en-US"].lastName[0]]
              .join("")
              .toUpperCase()
          ) : (
            // Otherwise, use Thai name
            [
              startsWithThaiVowel(name.th.firstName[0])
                ? name.th.firstName[1]
                : name.th.firstName[0],
              startsWithThaiVowel(name.th.lastName[0])
                ? name.th.lastName[1]
                : name.th.lastName[0],
            ].join("")
          )
        ) : // If nothing available, show the default vector
        undefined
      }
    </Avatar>
  );
};

export default DynamicAvatar;
