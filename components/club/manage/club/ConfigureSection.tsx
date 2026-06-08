// Imports
import ClubJoinPreview from "@/components/club/manage/club/ClubJoinPreview";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Club } from "@/utils/types/club";
import { Contact } from "@/utils/types/contact";
import {
  Actions,
  Button,
  Card,
  CardContent,
  Columns,
  MaterialIcon,
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
  Text,
} from "@suankularb-components/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { FC, forwardRef, useContext } from "react";

/**
 * A Section to configure a Club’s identity (name, logo, colors) and Contacts.
 *
 * @returns A `<div>`.
 */
const ConfigureSection: FC<{ club: Club }> = ({ club }) => {
  const { t } = useTranslation("club/manage");
  const { t: tx } = useTranslation("common");
  const locale = useLocale();
  const refreshProps = useRefreshProps();

  const { setSnackbar } = useContext(SnackbarContext);

  const { duration, easing } = useAnimationConfig();

  // Name and description were removed from the from since they are uneditable
  // for AY2026 activity day
  const { form, setForm, formValids, formOK, formProps } = useForm<
    "logo" | "accentColor" | "backgroundColor" | "line" | "discord"
  >([
    { key: "logo", required: true, defaultValue: club.logo_url },
    {
      key: "backgroundColor",
      defaultValue: club.background_color || "#fbfcff",
    },
    { key: "accentColor", defaultValue: club.accent_color || "#b50077" },
    {
      key: "line",
      defaultValue: club.contacts.find((contact) => contact.type === "line")
        ?.value,
      validate: (value: string) =>
        /^https:\/\/line.me(\/R)?\/ti\/g2?\/(.)+/.test(value),
    },
    {
      key: "discord",
      defaultValue: club.contacts.find((contact) => contact.type === "discord")
        ?.value,
      validate: (value: string) =>
        value.startsWith("https://discord.gg/") ||
        value.startsWith("https://discord.com/"),
    },
  ]);

  const CONTRAST_RATIO = 1.5;
  const hasAccessibleContrast =
    calculateLuminance(form.accentColor) /
      calculateLuminance(form.backgroundColor) >=
      CONTRAST_RATIO ||
    calculateLuminance(form.backgroundColor) /
      calculateLuminance(form.accentColor) >=
      CONTRAST_RATIO;

  const session = useSession();
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  async function handleSubmit() {
    // Validate form
    if (!formOK) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }

    // Update Club data
    // WARNING: no backend for this
    // const { error } = await mysk.fetch<Club>(`/v1/clubs/${club.id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     data: {
    //       name: { th: form.nameTH, "en-US": form.nameEN },
    //       description: { th: form.descTH, "en-US": form.descEN },
    //       background_color: form.backgroundColor,
    //       accent_color: form.accentColor,
    //     } as Partial<Club>,
    //     fetch_level: "id_only",
    //   }),
    // });
    // if (error) {
    //   logError("handleSubmit in ConfigureSection", error);
    //   return;
    // }
    // const { data: organization, error: updateClubError } = await supabase
    //   .from("clubs")
    //   .update({
    //     background_color: form.backgroundColor,
    //     accent_color: form.accentColor,
    //   })
    //   .eq("id", club.id)
    //   .select("id,organization_id");
    // console.log(organization)
    // if (updateClubError) {
    //   logSupabaseError(
    //     "handleSubmit (update club) in ConfigureSection",
    //     updateClubError
    //   );
    //   return;
    // }

    // let { error: updateOrganizationError } = await supabase
    //   .from("organizations")
    //   .update({
    //     name_th: form.nameTH,
    //     name_en: form.nameEN,
    //     description_th: form.descTH,
    //     description_en: form.descEN,
    //   })
    //   .eq("id", organization.organization_id);
    // if (updateOrganizationError) {
    //   logSupabaseError(
    //     "handleSubmit (update organization) in ConfigureSection",
    //     updateOrganizationError
    //   );
    //   return;
    // }

    // Update Contacts data
    // 1. Remove all associated Contacts
    // 2. Create new Contacts with new data

    // (1)
    const { error: contactsDeletionError } = await supabase
      .from("contacts")
      .delete()
      .or(`id.in.(${club.contacts.map((contact) => contact.id).join()})`);
    if (contactsDeletionError) {
      logError(
        "handleSubmit (delete Contacts) in ConfigureSection",
        contactsDeletionError,
      );
      return;
    }

    // (2)
    for (let contactType of ["line", "discord"]) {
      const value = form[contactType as "line" | "discord"];
      if (!value) continue;

      const { error } = await mysk.fetch<Club>(
        `/v1/clubs/${club.id}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              type: contactType,
              value,
            } as Omit<Contact, "id">,
            fetch_level: "id_only",
          }),
        },
      );
      if (error) {
        logError("handleSubmit (create Contacts) in ConfigureSection", error);
        return;
      }
    }

    // Update the UI
    await refreshProps();
    setSnackbar(<Snackbar>{tx("snackbar.changesSaved")}</Snackbar>);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Configure Identity Section */}
      <section
        aria-labelledby="header-configure"
        className="flex flex-col gap-4"
      >
        <div id="header-configure">
          <Text type="headline-medium" element="h2">
            {t("overview.configure.title")}
          </Text>
        </div>
        <Columns columns={3} className="!gap-y-12">
          <div className="flex flex-col gap-6">
            <ClubJoinPreview {...form} />

            {/* Inacessible contrast warning */}
            <AnimatePresence>
              {!hasAccessibleContrast && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: [1.5, 0.98, 1] }}
                  exit={{
                    opacity: 0,
                    transition: transition(duration.short4, easing.standard),
                  }}
                  transition={transition(
                    duration.medium2,
                    easing.standardDecelerate,
                  )}
                  className={cn(
                    `flex flex-row items-start gap-2 text-error sm:col-span-2`,
                  )}
                >
                  <MaterialIcon icon="warning" />
                  <p className="mt-0.5 font-bold">
                    {t("overview.configure.contrastWarning")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Columns columns={2} className="!gap-y-12 sm:col-span-2">
            <div className="sm:mb-4 lg:mb-0">
              <TextField
                appearance="outlined"
                label={t("overview.configure.form.name")}
                helperMsg={t("overview.configure.form.name_helper")}
                locale={locale}
                disabled
                value={club.name.th}
              />
            </div>
            <TextField
              appearance="outlined"
              label={t("overview.configure.form.nameEN")}
              helperMsg={t("overview.configure.form.nameEN_helper")}
              locale={locale}
              disabled
              value={club.name["en-US"] || ""}
            />
            {/* 
            The description field is removed because it is supposed to be 
            displayed in the explore page, but an explore page is now only the 
            event map
            */}
            {/* <TextField
              appearance="outlined"
              behavior="multi-line"
              label={t("overview.configure.form.desc")}
              className="h-32 [&>*:nth-child(2)]:!h-full"
              helperMsg={
                <Trans
                  i18nKey="overview.configure.form.desc_helper"
                  ns="club/manage"
                  components={{
                    a: <a href="/explore" target="_blank" className="link" />,
                  }}
                />
              }
              disabled
              value={club.description?.th}
            />
            <TextField
              appearance="outlined"
              behavior="multi-line"
              label={t("overview.configure.form.descEN")}
              className="h-32 [&>*:nth-child(2)]:!h-full"
              helperMsg={t("overview.configure.form.descEN_helper")}
              disabled
              value={club.description?.["en-US"] || ""}
            /> */}
            {/* <TextField
              appearance="outlined"
              label={t("configure.form.logo")}
              trailing={<MaterialIcon icon="attach_file" />}
              inputAttr={{ type: "file", accept: "image/*" }}
              locale={locale}
              {...formProps.logo}
            /> */}

            {/* Color configuration */}
            {/* <Card appearance="filled">
              <CardContent>
                <ColorPicker
                  id="input-accent-color"
                  label={t("configure.form.accentColor")}
                  value={form.accentColor}
                  onChange={(accentColor) => setForm({ ...form, accentColor })}
                />
                <ColorPicker
                  id="input-background-color"
                  label={t("configure.form.backgroundColor")}
                  value={form.backgroundColor}
                  onChange={(backgroundColor) =>
                    setForm({ ...form, backgroundColor })
                  }
                />
              </CardContent>
            </Card> */}

            {/* Contacts Information Section */}
            <section
              aria-labelledby="header-contacts"
              className="flex flex-col gap-5 sm:col-span-2"
            >
              <div id="header-contacts">
                <Text type="headline-small" element="h2">
                  {t("overview.contacts.title")}
                </Text>
              </div>
              <Text type="body-medium" element="p" className="-mt-3 mb-1">
                {t("overview.contacts.desc")}
              </Text>
              <TextField
                appearance="outlined"
                label={t("overview.contacts.form.line")}
                trailing={
                  <Button
                    appearance="text"
                    icon={<MaterialIcon icon="open_in_new" />}
                    alt={t("overview.contacts.action.openLink")}
                    disabled={!(form.line && formValids.line)}
                    href={form.line}
                    // eslint-disable-next-line react/display-name
                    element={forwardRef<HTMLAnchorElement>((props, ref) => (
                      <a {...props} ref={ref} target="_blank" />
                    ))}
                  />
                }
                {...formProps.line}
              />
              <TextField
                appearance="outlined"
                label={t("overview.contacts.form.discord")}
                trailing={
                  <Button
                    appearance="text"
                    icon={<MaterialIcon icon="open_in_new" />}
                    alt={t("overview.contacts.action.openLink")}
                    disabled={!(form.discord && formValids.discord)}
                    href={form.discord}
                    // eslint-disable-next-line react/display-name
                    element={forwardRef<HTMLAnchorElement>((props, ref) => (
                      <a {...props} ref={ref} target="_blank" />
                    ))}
                  />
                }
                {...formProps.discord}
              />
            </section>

            <Actions
              align="right"
              className="-mt-5 !grid grid-cols-2 !flex-nowrap sm:col-span-2 sm:!flex"
            >
              <Button
                appearance="outlined"
                className="!whitespace-nowrap"
                onClick={() =>
                  window.open(
                    `/club/join/${club.id}`,
                    "_blank",
                    "popup, width=393, height=793",
                  )
                }
              >
                {t("overview.configure.action.openPublicView")}
              </Button>
              <Button appearance="filled" onClick={handleSubmit}>
                {t("overview.configure.action.save")}
              </Button>
            </Actions>
          </Columns>
        </Columns>
      </section>
    </div>
  );
};

export default ConfigureSection;
