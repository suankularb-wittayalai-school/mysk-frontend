import { User, UserPermissionKey } from "@/utils/types/person";

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
  user: User | null,
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
  list: UserPermissionKey[],
  permission: UserPermissionKey,
): boolean;

export default function permitted(
  data: User | UserPermissionKey[] | null,
  permission: UserPermissionKey,
): boolean {
  if (!data) return false;
  if ("permissions" in data) return data.permissions.includes(permission);
  else return data.includes(permission);
}
