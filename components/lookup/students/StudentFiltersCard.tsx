import { StylableFC } from "@/utils/types/common";
import SearchFiltersCard from "../SearchFiltersCard";
import { TextField } from "@suankularb-components/react";

const StudentsFitlersCard: StylableFC = ({ style, className }) => {
  async function handleSubmit() {}

  return (
    <SearchFiltersCard onSubmit={handleSubmit}>
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
        label="Seach class"
        helperMsg="Enter fully the class this student is in"
      />
      <TextField
        appearance="outlined"
        label="Search class no."
        helperMsg="Enter fully the class no. of this student"
        inputAttr={{ type: "number", min: 1, max: 60 }}
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

