import { Migration } from '@mikro-orm/migrations';

export class Migration20260224235318 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "name" type varchar(150) using ("name"::varchar(150));`);

    this.addSql(`alter table "categories" add column "description" varchar(150) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "name" type varchar(255) using ("name"::varchar(255));`);

    this.addSql(`alter table "categories" drop column "description";`);
  }

}
