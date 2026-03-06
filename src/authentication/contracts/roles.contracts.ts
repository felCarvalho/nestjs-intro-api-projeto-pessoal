export abstract class RolesRepositoryContract<T> {
  abstract findBySlug(slug: 'user' | 'admin'): Promise<T | null>;
}
