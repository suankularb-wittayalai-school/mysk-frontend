// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC, useEffect, useState } from "react";

// SK Components
import {
  AssistChip,
  ChipSet,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import ShareDialog from "@/components/lookup/person/ShareDialog";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Types
import { Student, Teacher } from "@/utils/types/person";

const PersonActions: FC<{
  person?: Student | Teacher;
  suggestionsType?: "full" | "share-only";
}> = ({ person, suggestionsType }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "people.header.action" });

  const router = useRouter();

  // Admin check
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: metadata } = await getUserMetadata(supabase, user!.id);
      setIsAdmin(metadata?.isAdmin || false);
    })();
  }, []);

  // Dialog control
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [confDelOpen, setConfDelOpen] = useState<boolean>(false);

  /**
   * The Class relevant to the selected Person.
   */
  const classItem =
    person?.role === "student"
      ? person.class
      : person?.role === "teacher" && person.classAdvisorAt
      ? person.classAdvisorAt
      : null;

  async function handleEdit() {
    // TODO: Save changes to the Person to the database
    setEditOpen(false);
    router.replace(router.asPath);
  }

  async function handleDelete() {
    // TODO: Actually delete this Person from the database
    setConfDelOpen(false);
    router.replace(router.asPath);
  }

  return (
    <>
      <ChipSet className="[&~.skc-scrim]:mx-0">
        {suggestionsType !== "share-only" && classItem && (
          <>
            {/* See class */}
            <AssistChip
              icon={<MaterialIcon icon="groups" />}
              href={`/lookup/class/${classItem.number}`}
              element={Link}
            >
              {t("seeClass")}
            </AssistChip>

            {/* See schedule */}
            <AssistChip
              icon={<MaterialIcon icon="dashboard" />}
              href={`/lookup/class/${classItem.number}/schedule`}
              element={Link}
            >
              {t("seeSchedule")}
            </AssistChip>
          </>
        )}

        {/* Share */}
        <AssistChip
          icon={<MaterialIcon icon="share" />}
          onClick={() => setShareOpen(true)}
        >
          {t("share")}
        </AssistChip>

        {/* Admin actions */}
        {isAdmin && (
          <>
            <AssistChip
              icon={<MaterialIcon icon="edit" />}
              dangerous
              onClick={() => setEditOpen(true)}
            >
              {t("edit")}
            </AssistChip>
            <AssistChip
              icon={<MaterialIcon icon="delete" />}
              dangerous
              onClick={() => setConfDelOpen(true)}
            >
              {t("delete")}
            </AssistChip>
          </>
        )}
      </ChipSet>

      {person && (
        <ShareDialog
          person={person}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}

      {/* TODO: Edit Person Dialog */}

      <ConfirmDeleteDialog
        open={confDelOpen}
        onClose={() => setConfDelOpen(false)}
        onSubmit={handleDelete}
      />
    </>
  );
};

export default PersonActions;
