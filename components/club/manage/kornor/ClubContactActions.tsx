// Imports
import { Button, MaterialIcon } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { FC, forwardRef } from "react";

/**
 * Buttons to open a Contact link or copy the link to clipboard.
 *
 * @param value The URL of the Contact.
 */
const ClubContactActions: FC<{ value: string }> = ({ value }) => {
  const { t } = useTranslation("club/manage/kornor");

  return (
    <div className="-my-2.5 -mr-2 flex flex-row -space-x-1">
      <Button
        appearance="text"
        icon={<MaterialIcon icon="open_in_new" />}
        tooltip={t("data.table.rowAction.openLink")}
        href={value}
        // eslint-disable-next-line react/display-name
        element={forwardRef<HTMLAnchorElement>((props, ref) => (
          <a {...props} ref={ref} target="_blank" rel="noreferrer" />
        ))}
      />
      <Button
        appearance="text"
        icon={<MaterialIcon icon="content_copy" />}
        tooltip={t("data.table.rowAction.copyToClipboard")}
        onClick={() => navigator.clipboard.writeText(value)}
      />
    </div>
  );
};

export default ClubContactActions;
