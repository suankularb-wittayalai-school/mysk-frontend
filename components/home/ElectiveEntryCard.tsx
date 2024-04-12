import { Card, CardHeader, CardContent, Actions, Button } from "@suankularb-components/react"
import { StylableFC } from "@/utils/types/common"
import Link from "next/link"

/**
 * A Card that links to a page where the user can choose an Elective Subject.
 */
const ElectiveEntryCard: StylableFC = () => {
  return (
    <Card
      appearance="filled"
      className="!bg-primary-container"
    >
      <CardHeader
        title="Elective Subject"
        subtitle="Not chosen"
        className="Elective subject"
      />
      <CardContent className="!pt-0">
        <Actions align="right" className="!-mt-2.5">
          <Button appearance="filled" href="/learn/elective" element={Link}>
            Choose
          </Button>
        </Actions>
      </CardContent>
    </Card>
  )
}

export default ElectiveEntryCard