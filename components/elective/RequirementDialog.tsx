import { StylableFC } from "@/utils/types/common"
import { 
  Actions,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  FormGroup, 
  FormItem, 
  MaterialIcon 
} from "@suankularb-components/react"
import { useState } from "react";

const RequirementDialog: StylableFC<{ 
  open:boolean
  onClose: () => void;
}> = ({
  open,
  onClose
}) => {

  const requirements = ["นักเรียนต้องมีกีต้าร์หรือเครื่อง ดนตรีวงโยธวาทิต","นักเรียนต้องมีกีต้าร์หรือเครื่อง ดนตรีวงโยธวาทิต"]
  
  const [check,setCheck] = useState<boolean[]>(() => 
    requirements.map(() => (false))
  );

  const handleCheck = (index: number) => {
    const newChecks = [...check];
    newChecks[index] = !newChecks[index];
    setCheck(newChecks);
  }

  const allCheck: boolean = check.every((isCheck) => isCheck);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={280}
    >
      <DialogHeader
        className="!pb-6"
        icon={<MaterialIcon icon="front_hand" />}
        title="วิชานี้มีข้อกำหนด"
        desc="คุณต้องยอมรับข้อกำหนดดังกล่าวก่อนที่ จะเลือกวิชานี้"
      />
      <DialogContent>
        <FormGroup
          className="!pl-5 !pr-6 gap-2 [&>*:first-child]:hidden"
          label=""
        >
          {requirements.map((requirement, index) => (
            <FormItem
              key={index}
              label={requirement}
              className="!text-on-surface-variant !items-center"
            >
              <Checkbox
                value={check[index]}
                onChange={() => handleCheck(index)}
              />
            </FormItem>
          ))}
        </FormGroup>
      </DialogContent>
      <Actions>
        <Button
          appearance="text"
        >
          ยกเลิก
        </Button>
        <Button
          appearance="text"
          disabled={!allCheck}
        >
          ดำเนินการต่อ
        </Button>
      </Actions>
    </Dialog>
  )
}

export default RequirementDialog