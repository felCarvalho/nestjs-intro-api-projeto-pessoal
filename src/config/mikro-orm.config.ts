import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { credentialsSchema } from '../authentication/schema/credentials.schema';
import { PassHashSchema } from '../authentication/schema/passHash.schema';
import { RefreshTokenSchema } from '../authentication/schema/refreshToken.schema';
import { RoleSchema } from '../authentication/schema/roles.schema';
import { UserRolesSchema } from '../authentication/schema/userRoules.schema';
import { baseEntitySchema } from '../shared/core/baseEntity/base.schema';
import { UserSchema } from '../users/schema/user.schema';
import { PermissionSchema } from '../authorization/schema/permissions.schema';
import { RolesPermissionsSchema } from '../authorization/schema/rolesPermissons.schema';
import { categorySchema } from '../category/schema/category.schema';
import { taskSchema } from '../tasks/schema/task.schema';
import * as dotenv from 'dotenv';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  dotenv.config();
}

export default defineConfig({
  entities: [
    UserSchema,
    credentialsSchema,
    PassHashSchema,
    baseEntitySchema,
    RefreshTokenSchema,
    RoleSchema,
    UserRolesSchema,
    PermissionSchema,
    RolesPermissionsSchema,
    taskSchema,
    categorySchema,
  ],
  dbName: process.env.DATABASE || process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  driver: PostgreSqlDriver,
  migrations: {
    tableName: 'minhas-migrations',
    path: './dist/src/migrations',
    pathTs: './src/migrations',
    glob: '*.{js,ts}',
    silent: false,
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: true,
    emit: 'ts',
    fileName: (timestamp, name) => `${timestamp}_${name || 'migration'}`,
  },
  seeder: {
    path: './dist/src/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  extensions: [Migrator, SeedManager],
});
