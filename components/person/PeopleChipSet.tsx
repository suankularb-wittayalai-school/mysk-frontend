import PersonChip from "@/components/person/PersonChip";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import { ChipSet } from "@suankularb-components/react";
import { omit } from "radash";
import { ComponentProps, FC, useState } from "react";

/**
 * A Chip Set that displays a list of Students/Teachers, and when clicked, shows
 * a Student/Teacher Details Dialog Dialog with the details of the clicked
 * Student/Teacher.
 *
 * @param people The list of Students/Teachers to display.
 * @param scrollable If the parent element is not wide enough for all Chips to be visible, the Chip Set can be scrolled horizontally.
 */
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
      options={{ hideSeeClass: true }}
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
