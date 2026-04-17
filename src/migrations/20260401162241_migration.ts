import { Migration } from '@mikro-orm/migrations';

export class Migration20260401162241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tasks" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "tasks" alter column "status" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tasks" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "tasks" alter column "status" set not null;`);
  }

}
