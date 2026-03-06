export abstract class RolesPermissionsRepositoryContract<T> {
  abstract findByRole(slug: string): Promise<T | null>;
}
