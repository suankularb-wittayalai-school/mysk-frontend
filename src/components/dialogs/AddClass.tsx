// Modules
import { useTranslation } from "next-i18next";

import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Backend
import { db2Class } from "@utils/backend/database";

// Helpers
import { getCurrentAcedemicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ClassroomDB } from "@utils/types/database/class";
import { Class } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";

// Miscellaneous
import { classPattern } from "@utils/patterns";

const AddClassDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (classroom: Class) => void }): JSX.Element => {
  const { t } = useTranslation("common");

  // Hooks
  const [classroomNumber, setClassroomNumber] = useState<string>("");
  const [classroom, setClassroom] = useState<Class | null>(null);

  useEffect(() => {
    if (classroomNumber.match(/[1-6][0-1][1-9]/)) {
      supabase
        .from<ClassroomDB>("classroom")
        .select("*")
        .match({ number: classroomNumber, year: getCurrentAcedemicYear() })
        .limit(1)
        .single()
        .then((res) => {
          if (res.data) {
            db2Class(res.data).then((classroom) => {
              setClassroom(classroom);
            });
          } else {
            console.error(res.error);
            setClassroom(null);
          }
        });
    }
  }, [classroomNumber]);

  return (
    <Dialog
      type="regular"
      label="add-class"
      title={t("dialog.addClass.title")}
      actions={[
        { name: t("dialog.addClass.action.cancel"), type: "close" },
        { name: t("dialog.addClass.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => (classroom ? onSubmit(classroom) : null)}
    >
      <DialogSection name="input">
        <KeyboardInput
          name="class"
          type="text"
          label={t("dialog.addClass.class")}
          helperMsg={t("dialog.addClass.class_helper")}
          errorMsg={t("dialog.addClass.class_error")}
          useAutoMsg
          onChange={(e) => setClassroomNumber(e)}
          attr={{ pattern: classPattern }}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddClassDialog;
