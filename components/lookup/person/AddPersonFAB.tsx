// External libraries
import { FC, useEffect, useState } from "react";

// SK Components
import {
  Button,
  Columns,
  FAB,
  FullscreenDialog,
  MaterialIcon,
  MenuItem,
  Select,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { getUserMetadata } from "@/utils/backend/account";

const AddPersonFAB: FC = () => {
  // Dialog control
  const [addOpen, setAddOpen] = useState<boolean>(false);

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

  return isAdmin ? (
    <>
      <FAB
        color="primary"
        icon={<MaterialIcon icon="add" />}
        tooltip="Add person"
        stateOnScroll="minimize"
        onClick={() => setAddOpen(true)}
      />
      <FullscreenDialog
        title="Add student/teacher"
        action={
          <Button
            appearance="text"
            onClick={() => setAddOpen(false)}
            className="!text-primary"
          >
            Add
          </Button>
        }
        open={addOpen}
        width={720}
        onClose={() => setAddOpen(false)}
        className="[&_button]:!flex"
      >
        <div className="flex flex-col gap-y-8">
          <Columns columns={3} className="!gap-y-4">
            <Select appearance="filled" label="Role">
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </Columns>
          <Columns columns={3} className="!gap-y-4">
            <TextField appearance="filled" label="Prefix" />
            <TextField appearance="filled" label="First name" />
            <TextField appearance="filled" label="Middle name" />
            <TextField appearance="filled" label="Last name" />
          </Columns>
          <Columns columns={3} className="!gap-y-4">
            <TextField appearance="filled" label="English prefix" />
            <TextField appearance="filled" label="English first name" />
            <TextField appearance="filled" label="English middle name" />
            <TextField appearance="filled" label="English last name" />
          </Columns>
          <Columns columns={3} className="!gap-y-4">
            <TextField appearance="filled" label="Citizen ID" />
            <TextField
              appearance="filled"
              label="Birthdate"
              inputAttr={{ type: "date" }}
            />
            <TextField
              appearance="filled"
              label="School email"
              inputAttr={{ type: "email" }}
            />
          </Columns>
        </div>
      </FullscreenDialog>
    </>
  ) : null;
};

export default AddPersonFAB;
