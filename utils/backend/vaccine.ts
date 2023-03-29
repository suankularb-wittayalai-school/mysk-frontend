import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
} from "@/utils/types/common";
import { VaccineRecord } from "@/utils/types/vaccine";

export async function getVaccineRecordbyPersonId(
  supabase: DatabaseClient,
  personId: number
): Promise<BackendDataReturn<VaccineRecord[]>> {
  const { data, error } = await supabase
    .from("vaccine_records")
    .select("*")
    .eq("person", personId)
    .order("vaccination_date", { ascending: true });

  if (error) {
    // throw error;
    // console.error(error);
    return { data: [], error };
  }

  const vaccineRecord =
    data!.map((vaccineRecord, index) => ({
      id: vaccineRecord.id,
      provider: vaccineRecord.vaccine_name,
      vaccineDate: vaccineRecord.vaccination_date,
    })) ?? [];

  return { data: vaccineRecord, error: null };
}

export async function addVaccineRecord(
  supabase: DatabaseClient,
  vaccineRecord: VaccineRecord,
  personId: number
): Promise<BackendReturn> {
  const { error } = await supabase.from("vaccine_records").insert([
    {
      person: personId,
      vaccine_name: vaccineRecord.provider,
      vaccination_date: vaccineRecord.vaccineDate,
    },
  ]);

  return { error };
}

export async function updateVaccineRecords(
  supabase: DatabaseClient,
  vaccineRecords: VaccineRecord[],
  personID: number
): Promise<BackendReturn> {
  // Delete existing records
  const { error: deletionError } = await supabase
    .from("vaccine_records")
    .delete()
    .match({ person: personID });
  if (deletionError) {
    console.error(deletionError);
    return { error: deletionError };
  }

  // Add new records
  const { error } = await supabase.from("vaccine_records").upsert(
    vaccineRecords.map((vaccineRecord) => ({
      person: personID,
      vaccine_name: vaccineRecord.provider,
      vaccination_date: vaccineRecord.vaccineDate,
    }))
  );

  return { error };
}
