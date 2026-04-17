import { Migration } from '@mikro-orm/migrations';

export class Migration20260402143331 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tasks" add constraint "tasks_title_unique" unique ("title");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tasks" drop constraint "tasks_title_unique";`);
  }

}
