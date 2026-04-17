import { Migration } from '@mikro-orm/migrations';

export class Migration20260417123826 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permissions" ("slug" varchar(255) not null default '', "name" varchar(255) not null default '', "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "permissions_pkey" primary key ("slug"));`);
    this.addSql(`alter table "permissions" add constraint "permissions_name_unique" unique ("name");`);

    this.addSql(`create table "roles" ("slug" varchar(255) not null default '', "name" varchar(255) not null default '', "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "roles_pkey" primary key ("slug"));`);
    this.addSql(`alter table "roles" add constraint "roles_name_unique" unique ("name");`);

    this.addSql(`create table "roles_permissions" ("role_slug" varchar(255) not null, "permission_slug" varchar(255) not null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "roles_permissions_pkey" primary key ("role_slug", "permission_slug"));`);

    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "name" varchar(150) not null default 'nome', "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "users_pkey" primary key ("id"));`);

    this.addSql(`create table "refresh_tokens" ("id" uuid not null default gen_random_uuid(), "hash" varchar(255) not null default '', "status" varchar(255) not null default '', "user_id" uuid not null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "refresh_tokens_pkey" primary key ("id"));`);

    this.addSql(`create table "passHash" ("id" uuid not null default gen_random_uuid(), "hash" varchar(255) not null default '', "user_id" uuid not null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "passHash_pkey" primary key ("id"));`);

    this.addSql(`create table "credentials" ("id" uuid not null default gen_random_uuid(), "provider" varchar(255) not null default 'local', "identifier" varchar(255) not null default '', "user_id" uuid not null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "credentials_pkey" primary key ("id"));`);

    this.addSql(`create table "categories" ("id" uuid not null default gen_random_uuid(), "title" varchar(255) not null, "description" varchar(150) not null, "user_id" uuid not null, "status" varchar(255) null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "categories_pkey" primary key ("id"));`);

    this.addSql(`create table "tasks" ("id" uuid not null default gen_random_uuid(), "title" varchar(255) not null, "description" varchar(255) not null, "user_id" uuid not null, "category_id" uuid null, "completed" varchar(255) not null, "status" varchar(255) null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "tasks_pkey" primary key ("id"));`);
    this.addSql(`create index "tasks_title_index" on "tasks" ("title");`);

    this.addSql(`create table "user_roles" ("user_id" uuid not null, "role_slug" varchar(255) not null, "update_at" timestamptz not null default now(), "create_at" timestamptz not null default now(), "delete_at" timestamptz null, constraint "user_roles_pkey" primary key ("user_id", "role_slug"));`);

    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_role_slug_foreign" foreign key ("role_slug") references "roles" ("slug") on update cascade;`);
    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_permission_slug_foreign" foreign key ("permission_slug") references "permissions" ("slug") on update cascade;`);

    this.addSql(`alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "passHash" add constraint "passHash_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "credentials" add constraint "credentials_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "categories" add constraint "categories_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "tasks" add constraint "tasks_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "tasks" add constraint "tasks_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_role_slug_foreign" foreign key ("role_slug") references "roles" ("slug") on update cascade;`);
  }

}
