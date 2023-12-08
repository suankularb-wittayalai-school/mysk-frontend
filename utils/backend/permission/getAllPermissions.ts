import logError from "@/utils/helpers/logError";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";
import { UserPermissionKey } from "@/utils/types/person";

export default async function getAllPermissions(
  supabase: DatabaseClient,
): Promise<BackendReturn<UserPermissionKey[]>> {
  const { data, error } = await supabase.from("permissions").select("name");

  if (error) {
    logError("getAllPermissions", error);
    return { data: null, error };
  }

  const permissions = data.map(
    (permission) => <UserPermissionKey>permission.name,
  );

  return { data: permissions, error: null };
}
