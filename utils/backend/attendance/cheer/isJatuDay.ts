import logError from "@/utils/helpers/logError";
import { BackendReturn } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";

export default async function isJatuDay(
  date: string,
  mysk: MySKClient,
): Promise<BackendReturn<boolean>> {
  const { data, error } = await mysk.fetch<boolean>(
    `/v1/attendance/cheer/in-jaturamitr-period/${date}`,
    { method: "GET" },
  );
  if (error) {
    logError("isJatuDay", error);
    return { data: null, error: error };
  }
  return { data: data, error: null };
}
