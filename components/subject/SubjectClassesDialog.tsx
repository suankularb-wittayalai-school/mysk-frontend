// Externa libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

// SK Components
import { FullscreenDialog, Progress } from "@suankularb-components/react";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { DialogComponent } from "@/utils/types/common";
import { SubjectListItem } from "@/utils/types/subject";

/**
 * Allows the Teacher to view and edit the Classes that they teach this Subject
 * to. Behind the scenes, this is a list of Room Subjects connected to this
 * Teacher and this Subject.
 *
 * @param open If the Full-screen Dialog is open and shown.
 * @param onClose The function triggered when the Full-screen Dialog is closed.
 * @param subjectID The ID of the Subject (not to be confused with Subject code).
 *
 * @returns A Full-screen Dialog.
 */
const SubjectClassesDialog: DialogComponent<{
  subject: SubjectWNameAndCode;
}> = ({ open, onClose, subject }) => {
  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const subjectRooms: SubjectListItem[] = [];

  useEffect(() => {
    if (!open || subjectRooms.length) return;
    withLoading(
      async () => {
        // TODO: Fetch Room Subjects from Supabase
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [open]);

  return (
    <FullscreenDialog
      open={open}
      title="Media Production 2"
      // TODO: Remove this when `action` is optional.
      action={null as any}
      width={640}
      onClose={onClose}
      className="relative"
    >
      <Progress
        appearance="linear"
        alt="Loading classes…"
        visible={loading}
        className="absolute inset-0 bottom-auto top-16"
      />
      {subjectID}
    </FullscreenDialog>
  );
};

export default SubjectClassesDialog;
