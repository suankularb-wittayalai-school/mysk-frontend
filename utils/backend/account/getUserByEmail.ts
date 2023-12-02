// Imports
import getAllPermissions from "@/utils/backend/permission/getAllPermissions";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { User, UserPermissions, UserRole } from "@/utils/types/person";
import { omit } from "radash";

/**
 * Gets a user by their email.
 *
 * @param supabase A Supabase client.
 * @param email The email to search for.
 *
 * @returns A Backend Return with User.
 */
export default async function getUserByEmail(
  supabase: DatabaseClient,
  email: string,
): Promise<BackendReturn<User | null>> {
  const { data, error } = await supabase
    .from("users")
    .select(
      `id,
      email,
      is_admin,
      onboarded,
      role,
      user_permissions(permissions(name))`,
    )
    .eq("email", email)
    .maybeSingle();
  if (error) {
    logError("getUserByEmail (user)", error);
    return { data: null, error };
  }
  if (!data) return { data: null, error: null };

  const { data: allPermissions, error: permissionsError } =
    await getAllPermissions(supabase);
  if (permissionsError) {
    logError("getUserByEmail (permissions)", permissionsError);
    return { data: null, error: permissionsError };
  }

  const user = {
    ...omit(data!, ["role", "user_permissions"]),
    role: <UserRole>data!.role,
    permissions: Object.fromEntries(
      allPermissions.map((permission) => [
        permission,
        data!.user_permissions.some(
          (item) => item.permissions!.name === permission,
        ),
      ]),
    ) as UserPermissions,
  };

  return { data: user, error: null };
}
