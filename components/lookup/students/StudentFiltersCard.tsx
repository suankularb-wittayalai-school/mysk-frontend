import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, TextField } from "@suankularb-components/react";

/**
 * The Search Filters Card for Students.
 */
const StudentsFitlersCard: StylableFC = ({ style, className }) => {
  async function handleSubmit() {}

  return (
    <SearchFiltersCard
      icon={<MaterialIcon icon="face_6" />}
      title="Search students"
      onSubmit={handleSubmit}
      style={style}
      className={className}
    >
      <TextField
        appearance="outlined"
        label="Search full name"
        helperMsg="Enter partially or fully the full name of a student"
      />
      <TextField
        appearance="outlined"
        label="Search nickname"
        helperMsg="Enter partially or fully the full name of a student"
      />
      <TextField
        appearance="outlined"
        label="Search contact"
        helperMsg="Enter fully a username, email, tel., or URL of a student’s contact"
      />
    </SearchFiltersCard>
  );
};

export default StudentsFitlersCard;

