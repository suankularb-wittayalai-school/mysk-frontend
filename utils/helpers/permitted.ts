import { User, UserPermissionKey, UserPermissions } from "@/utils/types/person";

/**
 * Check if a user has a given permission.
 * 
 * @param user The user to check.
 * @param permission The permission to check for.
 * 
 * @example
 * The following example checks if a user has the permission to see management.
 * 
 * ```ts
 * const { data: user } = await getUserByEmail(supabase, email);
 * if (permitted(user, UserPermissionKey.can_see_management))
 *   router.push("/manage");
 * ```
 * 
 * @returns Whether the user has the permission.
 */
export default function permitted(
  user: User,
  permission: UserPermissionKey,
): boolean;

/**
 * Check if a list of permissions has a given permission set to true.
 * 
 * @param list The list of permissions to check.
 * @param permission The permission to check for.
 * 
 * @returns Whether the list has the permission.
 */
export default function permitted(
  list: UserPermissions,
  permission: UserPermissionKey,
): boolean;

export default function permitted(
  data: User | UserPermissions,
  permission: UserPermissionKey,
): boolean {
  let list: UserPermissions;

  // If the data is a user, get the permissions from the user.
  if ("permissions" in data) {
    // Bypass permissions if the user is an admin.
    if (data.is_admin) return true;
    list = data.permissions;
  } else list = data;

  // Return the permission if it exists, otherwise return false.
  return list[permission] || false;
}
