import { Migration } from '@mikro-orm/migrations';

export class Migration20260414113821 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tasks" drop constraint "tasks_title_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tasks" add constraint "tasks_title_unique" unique ("title");`);
  }

}
