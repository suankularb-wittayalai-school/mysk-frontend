import PersonAvatar from "@/components/common/PersonAvatar";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { InputChip } from "@suankularb-components/react";
import { ComponentProps, Fragment, ReactNode, useState } from "react";

/**
 * An Input Chip that displays a Student/Teacher’s name and profile picture.
 *
 * @param person The Student/Teacher to display the details of.
 * @param expandable Whether the Chip is expandable and can be clicked to show more details.
 * @param onClick Triggers when the Chip is clicked.
 */
const PersonChip: StylableFC<{
  person: Omit<ComponentProps<typeof PersonAvatar>, "expandable"> &
    ComponentProps<typeof WithPersonDetails>["person"];
  expandable?: boolean;
  onClick?: () => void;
}> = ({ person, expandable, onClick, style, className }) => {
  const locale = useLocale();

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Wrap the Chip in a With Person Details component if it is expandable
  const Wrapper = expandable
    ? ({ children }: { children: ReactNode }) => (
        <WithPersonDetails
          open={detailsOpen}
          person={person}
          onClose={() => setDetailsOpen(false)}
        >
          {children}
        </WithPersonDetails>
      )
    : Fragment;

  return (
    <Wrapper>
      <InputChip
        avatar={<PersonAvatar profile={person.profile} />}
        onClick={
          expandable || onClick
            ? () => {
                onClick?.();
                if (expandable) setDetailsOpen(true);
              }
            : undefined
        }
        style={style}
        className={className}
      >
        {getLocaleName(locale, person, { middleName: false, lastName: "abbr" })}
      </InputChip>
    </Wrapper>
  );
};

export default PersonChip;
