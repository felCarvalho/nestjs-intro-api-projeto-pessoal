import { Migration } from '@mikro-orm/migrations';

export class Migration20260401155804 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tasks" add column "status" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tasks" drop column "status";`);
  }

}
