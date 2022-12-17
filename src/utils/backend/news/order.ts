import { BackendDataReturn } from "@utils/types/common";

export async function getNoOfOrderPages(): Promise<
  BackendDataReturn<number, null>
> {
  // TODO: Get numbers of of order pages (divide total number of orders by
  // like 50 or something)
  console.error("function not implemented.");

  return { data: 3, error: null };
}
