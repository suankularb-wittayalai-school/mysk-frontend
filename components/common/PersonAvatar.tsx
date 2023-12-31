// Imports
import PersonAvatarDialog from "@/components/common/PersonAvatarDialog";
import cn from "@/utils/helpers/cn";
import startsWithThaiVowel from "@/utils/helpers/startsWithThaiVowel";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import {
  Avatar,
  Interactive,
  InteractiveProps,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * An Avatar for a Person.
 *
 * @param first_name The first name of the Person.
 * @param last_name The last name of the Person.
 * @param profile The profile image of the Person.
 * @param expandable Whether the Avatar can show a larger version of the profile image.
 *
 * @example
 * ```tsx
 * <PersonAvatar {...person} expandable />
 * ```
 */
const PersonAvatar: StylableFC<
  Partial<Pick<Person, "first_name" | "last_name" | "profile">> & {
    expandable?: boolean;
  }
> = ({
  first_name,
  last_name,
  profile,
  expandable: preferExpandable,
  style,
  className,
}) => {
  const locale = useLocale();
  const { duration, easing } = useAnimationConfig();

  const expandable = preferExpandable === true && typeof profile === "string";
  const [open, setOpen] = useState(false);

  // Ensure that the Avatar is a circle
  className = [className, `aspect-square`].join(" ");

  /**
   * The monogram of the Person, shown when no profile image is available.
   */
  const monogram =
    first_name && last_name
      ? // Use English name, if available
        locale === "en-US" && first_name["en-US"] && last_name["en-US"]
        ? (first_name["en-US"][0] + last_name["en-US"][0]).toUpperCase()
        : // Otherwise, use Thai name
          startsWithThaiVowel(first_name.th[0])
          ? first_name.th[1]
          : first_name.th[0]
      : // If nothing available, show the default vector
        undefined;

  /**
   * The element to use for the Interactive component.
   */
  const interactiveElement = expandable
    ? (props: InteractiveProps) => (
        <motion.div
          layoutId={profile}
          transition={transition(duration.medium2, easing.standard)}
          {...props}
        />
      )
    : undefined;

  return (
    <>
      <Interactive
        stateLayerEffect={expandable}
        rippleEffect={expandable}
        onClick={expandable ? () => setOpen(true) : undefined}
        element={interactiveElement}
        style={expandable ? style : undefined}
        className={
          expandable
            ? cn(`-m-1 cursor-pointer rounded-full p-1 before:z-10`, className)
            : `contents`
        }
      >
        <Avatar
          style={expandable ? style : undefined}
          className={!expandable ? cn(`relative`, className) : undefined}
        >
          {
            // Use profile image, if available
            profile ? (
              <Image
                src={profile}
                alt=""
                width={48}
                height={48}
                className="absolute inset-0 bg-white"
              />
            ) : (
              // Use the first letter of first name and last name, if available
              // Otherwise, show the default vector
              monogram
            )
          }
        </Avatar>
      </Interactive>

      {expandable && (
        <PersonAvatarDialog
          open={open}
          profile={profile}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default PersonAvatar;
