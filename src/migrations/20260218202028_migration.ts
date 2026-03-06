import { Migration } from '@mikro-orm/migrations';

export class Migration20260218202028 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "permissions" drop column "updated_at", drop column "created_at";`);

    this.addSql(`alter table "permissions" add column "update_at" timestamptz not null default now(), add column "create_at" timestamptz not null default now();`);
    this.addSql(`alter table "permissions" rename column "deleted_at" to "delete_at";`);

    this.addSql(`alter table "roles" drop column "updated_at", drop column "created_at";`);

    this.addSql(`alter table "roles" add column "update_at" timestamptz not null default now(), add column "create_at" timestamptz not null default now();`);
    this.addSql(`alter table "roles" rename column "deleted_at" to "delete_at";`);

    this.addSql(`alter table "roles_permissions" drop column "updated_at", drop column "created_at";`);

    this.addSql(`alter table "roles_permissions" add column "update_at" timestamptz not null default now(), add column "create_at" timestamptz not null default now();`);
    this.addSql(`alter table "roles_permissions" rename column "deleted_at" to "delete_at";`);

    this.addSql(`alter table "users" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "refresh_tokens" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "passHash" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "credentials" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "categories" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "tasks" drop column "updated_at", drop column "created_at", drop column "deleted_at";`);

    this.addSql(`alter table "user_roles" drop column "updated_at", drop column "created_at";`);

    this.addSql(`alter table "user_roles" add column "update_at" timestamptz not null default now(), add column "create_at" timestamptz not null default now();`);
    this.addSql(`alter table "user_roles" rename column "deleted_at" to "delete_at";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "categories" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);

    this.addSql(`alter table "credentials" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);

    this.addSql(`alter table "passHash" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);

    this.addSql(`alter table "permissions" drop column "update_at", drop column "create_at";`);

    this.addSql(`alter table "permissions" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "permissions" rename column "delete_at" to "deleted_at";`);

    this.addSql(`alter table "refresh_tokens" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);

    this.addSql(`alter table "roles" drop column "update_at", drop column "create_at";`);

    this.addSql(`alter table "roles" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "roles" rename column "delete_at" to "deleted_at";`);

    this.addSql(`alter table "roles_permissions" drop column "update_at", drop column "create_at";`);

    this.addSql(`alter table "roles_permissions" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "roles_permissions" rename column "delete_at" to "deleted_at";`);

    this.addSql(`alter table "tasks" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);

    this.addSql(`alter table "user_roles" drop column "update_at", drop column "create_at";`);

    this.addSql(`alter table "user_roles" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "user_roles" rename column "delete_at" to "deleted_at";`);

    this.addSql(`alter table "users" add column "updated_at" timestamptz(6) not null default now(), add column "created_at" timestamptz(6) not null default now(), add column "deleted_at" timestamptz(6) null;`);
  }

}
