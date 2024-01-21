import LogOutDialog from "@/components/account/LogOutDialog";
import AboutPersonSummary from "@/components/account/about/AboutPersonSummary";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Actions, Button } from "@suankularb-components/react";
import { ComponentProps, useState } from "react";

/**
 * The header of the About You page.
 *
 * @param person The Person to display the information of.
 * @param onSave Triggers when the user clicks the “Save changes” Button.
 */
const AboutHeader: StylableFC<{
  person: ComponentProps<typeof AboutPersonSummary>["person"];
  onSave: () => void;
}> = ({ person, onSave, style, className }) => {
  const [logOutOpen, setLogOutOpen] = useState(false);

  return (
    <header
      style={style}
      className={cn(
        `grid flex-row items-end gap-2 px-4 sm:px-0 md:flex`,
        className,
      )}
    >
      <AboutPersonSummary person={person} className="grow" />
      <Actions className="!grid grid-cols-2 md:!flex">
        {/* Log out */}
        <Button
          appearance="outlined"
          dangerous
          onClick={() => setLogOutOpen(true)}
        >
          Log out
        </Button>
        <LogOutDialog open={logOutOpen} onClose={() => setLogOutOpen(false)} />

        {/* Save changes */}
        <Button appearance="filled" onClick={onSave}>
          Save changes
        </Button>
      </Actions>
    </header>
  );
};

export default AboutHeader;
