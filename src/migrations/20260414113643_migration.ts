import { Migration } from '@mikro-orm/migrations';

export class Migration20260414113643 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "categories" drop constraint "categories_title_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "categories" add constraint "categories_title_unique" unique ("title");`);
  }

}
