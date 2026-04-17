import { Migration } from '@mikro-orm/migrations';

export class Migration20260329160006 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "categories" add column "status" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "categories" drop column "status";`);
  }
}
