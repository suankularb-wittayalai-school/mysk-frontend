import ContactDialog from "@/components/account/ContactDialog";
import cn from "@/utils/helpers/cn";
import getContactURL from "@/utils/helpers/contact/getContactURL";
import { StylableFC } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import {
  Button,
  MaterialIcon,
  Menu,
  MenuItem,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * An overflow Menu and toggle for Contact.
 *
 * @param contact A Contact object.
 * @param onChange Triggers when this Contact is edited.
 * @param onRemove Triggers when this Contact is removed.
 */
const ContactOverflow: StylableFC<{
  contact: Contact;
  onChange?: (value: Contact) => void;
  onRemove?: () => void;
}> = ({ contact, onChange, onRemove, style, className }) => {
  const { t } = useTranslation("account", { keyPrefix: "contacts" });

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div style={style} className={cn(`relative`, className)}>
      <Button
        appearance="text"
        icon={<MaterialIcon icon="more_vert" />}
        onClick={() => setMenuOpen(!menuOpen)}
        className="!text-outline state-layer:!bg-on-surface"
      />
      <Menu open={menuOpen} onBlur={() => setMenuOpen(false)}>
        <MenuItem
          icon={<MaterialIcon icon="edit" />}
          onClick={() => setEditOpen(true)}
        >
          {t("action.edit")}
        </MenuItem>
        <MenuItem icon={<MaterialIcon icon="delete" />} onClick={onRemove}>
          {t("action.delete")}
        </MenuItem>
        <MenuItem
          icon={<MaterialIcon icon="open_in_new" />}
          href={getContactURL(contact)}
          element={(props) => <a {...props} target="_blank" rel="noreferrer" />}
        >
          {t("action.link")}
        </MenuItem>
      </Menu>
      <ContactDialog
        open={editOpen}
        contact={contact}
        onClose={() => setEditOpen(false)}
        onSubmit={(contact) => {
          onChange?.(contact);
          setEditOpen(false);
        }}
      />
    </div>
  );
};

export default ContactOverflow;
