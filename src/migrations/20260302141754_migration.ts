import { Migration } from '@mikro-orm/migrations';

export class Migration20260302141754 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_tokens" rename column "refresh_hash" to "hash";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_tokens" rename column "hash" to "refresh_hash";`);
  }

}
