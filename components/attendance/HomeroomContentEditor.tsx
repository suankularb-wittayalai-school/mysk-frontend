// Imports
import { HomeroomView } from "@/components/attendance/TodaySummary";
import useHomeroomContent from "@/utils/helpers/attendance/useHomeroomContent";
import { HomeroomContent } from "@/utils/types/attendance";
import { Actions, Button, TextField } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

/**
 * Allows the user to edit the content of the Homeroom Content for a Classroom.
 *
 * @param homeroomContent The Homeroom Content to be edited.
 * @param classroomID The ID of the Classroom that this Homeroom Content is for.
 * @param onViewChange Should change the view of the Homeroom Content Editor.
 */
const HomeroomContentEditor: FC<{
  homeroomContent: HomeroomContent;
  classroomID: string;
  onViewChange: (view: HomeroomView) => void;
}> = ({ homeroomContent, classroomID, onViewChange }) => {
  const { t } = useTranslation("attendance/day");

  const { field, setField, handleCancel, handleSave, loading } =
    useHomeroomContent(
      homeroomContent,
      classroomID,
      () =>
        onViewChange(
          homeroomContent.homeroom_content
            ? HomeroomView.view
            : HomeroomView.empty,
        ),
      () => onViewChange(HomeroomView.view),
    );

  return (
    <>
      <TextField<string>
        appearance="outlined"
        label={t("homeroom.field")}
        behavior="multi-line"
        value={field}
        onChange={setField}
        inputAttr={{ readOnly: loading }}
        className="[&_textarea]:min-h-32"
      />
      <Actions>
        <Button appearance="text" onClick={handleCancel}>
          {t("homeroom.action.cancel")}
        </Button>
        <Button appearance="filled" disabled={loading} onClick={handleSave}>
          {t("homeroom.action.save")}
        </Button>
      </Actions>
    </>
  );
};

export default HomeroomContentEditor;
