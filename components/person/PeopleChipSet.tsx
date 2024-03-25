import PersonChip from "@/components/person/PersonChip";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import { ChipSet } from "@suankularb-components/react";
import { omit } from "radash";
import { ComponentProps, FC, useState } from "react";

const PersonChipSet: FC<
  {
    people: ComponentProps<typeof PersonChip>["person"][];
  } & Omit<ComponentProps<typeof ChipSet>, "children">
> = (props) => {
  const { people } = props;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<
    ComponentProps<typeof WithPersonDetails>["person"]
  >(people[0]);

  return (
    <WithPersonDetails
      open={detailsOpen}
      person={selectedPerson}
      onClose={() => setDetailsOpen(false)}
    >
      <ChipSet {...omit(props, ["people"])}>
        {people.map((person) => (
          <PersonChip
            key={person.id}
            person={person}
            onClick={() => {
              setSelectedPerson(person);
              setDetailsOpen(true);
            }}
          />
        ))}
      </ChipSet>
    </WithPersonDetails>
  );
};

export default PersonChipSet;
