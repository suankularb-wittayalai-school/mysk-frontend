import SnackbarContext from "@/contexts/SnackbarContext";
import addContactToPerson from "@/utils/backend/contact/addContactToPerson";
import createContact from "@/utils/backend/contact/createContact";
import updateContact from "@/utils/backend/contact/updateContact";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Contact } from "@/utils/types/contact";
import { Snackbar } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { createElement, useContext } from "react";

/**
 * Returns a set of functions to handle Contact actions.
 */
export default function useContactActions(personID: string) {
  const { t } = useTranslation("common");

  const refreshProps = useRefreshProps();
  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();

  /**
   * Creates and add a Contact to this Person.
   *
   * @param contact The Contact to add.
   */
  async function handleAdd(contact: Contact) {
    const { data: contactID, error } = await createContact(supabase, contact);
    if (error) {
      setSnackbar(createElement(Snackbar, null, t("snackbar.failure")));
      return;
    }
    const { error: personError } = await addContactToPerson(
      supabase,
      contactID,
      personID,
    );
    if (personError)
      setSnackbar(createElement(Snackbar, null, t("snackbar.failure")));
    else refreshProps();
  }

  /**
   * Edits a given Contact.
   *
   * @param contact The new data for the Contact.
   */
  async function handleEdit(contact: Contact) {
    const { error } = await updateContact(supabase, contact);
    if (error)
      setSnackbar(createElement(Snackbar, null, t("snackbar.failure")));
    else refreshProps();
  }

  /**
   * Delete a given Contact from Supabase.
   *
   * @param contactID The ID of the Contact to delete.
   */
  async function handleRemove(contactID: string) {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", contactID);
    if (error)
      setSnackbar(createElement(Snackbar, null, t("snackbar.failure")));
    else refreshProps();
  }

  return { handleAdd, handleEdit, handleRemove };
}
