import PersonAvatarDialog from "@/components/common/PersonAvatarDialog";
import cn from "@/utils/helpers/cn";
import startsWithThaiVowel from "@/utils/helpers/startsWithThaiVowel";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import { Avatar, Interactive } from "@suankularb-components/react";
import Image from "next/image";
import { useState } from "react";

/**
 * The default size in pixels of the Avatar.
 */
const DEFAULT_SIZE = 48;

/**
 * An Avatar for a Person.
 *
 * @param first_name The first name of the Person.
 * @param last_name The last name of the Person.
 * @param profile The profile image of the Person.
 * @param expandable Whether the Avatar can show a larger version of the profile image.
 * @param size The size of the Avatar in pixels.
 *
 * @example
 * ```tsx
 * <PersonAvatar {...person} expandable />
 * ```
 */
const PersonAvatar: StylableFC<
  Partial<Pick<Person, "first_name" | "last_name" | "profile">> & {
    expandable?: boolean;
    size?: number;
  }
> = ({
  first_name,
  last_name,
  profile,
  expandable: preferExpandable,
  size,
  style,
  className,
}) => {
  const definedSize = size || DEFAULT_SIZE;

  const locale = useLocale();

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

  return (
    <>
      <Interactive
        stateLayerEffect={expandable}
        rippleEffect={expandable}
        onClick={expandable ? () => setOpen(true) : undefined}
        style={{
          ...style,
          ...(expandable
            ? { width: definedSize + 8, height: definedSize + 8 }
            : size
              ? { width: size, height: size }
              : undefined),
        }}
        className={
          expandable
            ? cn(`-m-1 cursor-pointer rounded-full p-1 before:z-10`, className)
            : `contents`
        }
      >
        <Avatar
          style={{
            ...(!expandable ? style : undefined),
            ...(size ? { width: size, height: size } : undefined),
          }}
          className={!expandable ? cn(`relative`, className) : undefined}
        >
          {
            // Use profile image, if available
            profile ? (
              <Image
                src={profile}
                alt=""
                width={definedSize}
                height={definedSize}
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
