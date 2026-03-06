export class Permissions {
  name: string = '';
  slug: string = '';
  createAt: string = new Date().toISOString();
  deleteAt: string | null = null;
  updateAt: string = new Date().toISOString();
}
