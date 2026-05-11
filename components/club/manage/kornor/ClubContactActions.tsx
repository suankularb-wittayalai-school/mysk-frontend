// Imports
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC, forwardRef } from "react";

/**
 * Buttons to open a Contact link or copy the link to clipboard.
 *
 * @param value The URL of the Contact.
 *
 * @returns A `<div>` that is similar to an Actions.
 */
const ClubContactActions: FC<{ value: string }> = ({ value }) => {
  const { t } = useTranslation("manage", {
    keyPrefix: "kornor.data.table.rowAction",
  });

  return (
    <div className="-my-2.5 -mr-2 flex flex-row -space-x-1">
      <Button
        appearance="text"
        icon={<MaterialIcon icon="open_in_new" />}
        tooltip={t("copyToClipboard")}
        href={value}
        // eslint-disable-next-line react/display-name
        element={forwardRef<HTMLAnchorElement>((props, ref) => (
          <a {...props} ref={ref} target="_blank" rel="noreferrer" />
        ))}
      />
      <Button
        appearance="text"
        icon={<MaterialIcon icon="content_copy" />}
        tooltip={t("openLink")}
        onClick={() => navigator.clipboard.writeText(value)}
      />
    </div>
  );
};

export default ClubContactActions;
