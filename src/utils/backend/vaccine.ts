import { DatabaseClient } from "@utils/types/common";
import { VaccineRecord } from "@utils/types/vaccine";

export function getVaccineRecordbyPersonId(
  supabase: DatabaseClient,
  personId: number
): Promise<VaccineRecord> {
  return new Promise((resolve, reject) => {
    supabase
      .from("vaccine")
      .select("*")
      .eq("id", personId)
      .then((data) => {
        if (data.error) reject(data.error);
        else resolve(data.data[0]);
      });
  });
}
