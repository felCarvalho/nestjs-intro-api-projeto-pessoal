import { Migration } from '@mikro-orm/migrations';

export class Migration20260324194014 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "tasks" drop constraint "tasks_category_id_foreign";`,
    );

    this.addSql(`alter table "tasks" alter column "category_id" drop default;`);
    this.addSql(
      `alter table "tasks" alter column "category_id" type uuid using ("category_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "tasks" alter column "category_id" drop not null;`,
    );
    this.addSql(
      `alter table "tasks" add constraint "tasks_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "tasks" drop constraint "tasks_category_id_foreign";`,
    );

    this.addSql(`alter table "tasks" alter column "category_id" drop default;`);
    this.addSql(
      `alter table "tasks" alter column "category_id" type uuid using ("category_id"::text::uuid);`,
    );
    this.addSql(`alter table "tasks" alter column "category_id" set not null;`);
    this.addSql(
      `alter table "tasks" add constraint "tasks_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`,
    );
  }
}
