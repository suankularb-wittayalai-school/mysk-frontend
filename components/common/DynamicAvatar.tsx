// External libraries
import Image from "next/image";
import { FC } from "react";

// SK Components
import { Avatar } from "@suankularb-components/react";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Person } from "@/utils/types/person";

const DynamicAvatar: FC<
  Pick<Person, "name" | "profile"> & { className?: string }
> = ({ name, profile, className }) => {
  // Translation
  const locale = useLocale();

  return (
    <Avatar {...{ className }}>
      {profile ? (
        <Image src={profile} alt="" />
      ) : locale === "en-US" && name["en-US"]?.firstName ? (
        [name["en-US"].firstName[0], name["en-US"].lastName[0]]
          .join("")
          .toUpperCase()
      ) : (
        [name.th.firstName[0], name.th.lastName[0]].join("")
      )}
    </Avatar>
  );
};

export default DynamicAvatar;
