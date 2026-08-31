import logError from "@/utils/helpers/logError";
import { BackendReturn } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";

/**
 * Check whether the date is Jaturamitr Day.
 *
 * @param date The date to check.
 * @param mysk The MySK Client to use.
 *
 * @returns A True if the date is Jaturamitr Day or False if not.
 */

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
