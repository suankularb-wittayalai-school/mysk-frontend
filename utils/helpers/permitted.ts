import { User, UserPermissionKey, UserRole } from "@/utils/types/person";

/**
 * Check if a user has a given permission.
 *
 * @param user The user to check.
 * @param permission The permission or role to check for.
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
  permission: UserPermissionKey | UserRole,
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
  permission: UserPermissionKey | UserRole,
): boolean {
  if (!data) return false;
  if ("permissions" in data)
    return (
      data.is_admin ||
      data.role === (permission as UserRole) ||
      data.permissions.includes(permission as UserPermissionKey)
    );
  else return data.includes(permission as UserPermissionKey);
}
