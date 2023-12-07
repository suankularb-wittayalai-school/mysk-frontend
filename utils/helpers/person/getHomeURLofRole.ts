import { UserRole } from "@/utils/types/person";

/**
 * Get the home URL of a user role.
 *
 * @param role The user role.
 *
 * @returns The path to the home URL of the user role.
 */
export default function getHomeURLofRole(role: UserRole) {
  switch (role) {
    case UserRole.student:
      return "/learn";
    case UserRole.teacher:
      return "/teach";
    case UserRole.management:
      return "/manage";
    case UserRole.organization:
      return "/organization";
    case UserRole.staff:
      return "/staff";
    default:
      return "/";
  }
}
