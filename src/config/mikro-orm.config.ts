import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'; // ou seu driver
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
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (error) {
  console.error('Error loading environment variables:', error);
}

export default defineConfig({
  // entities: ['./src/**/*.schema.js'],
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
  dbName: process.env.DATABASE ?? '',
  name: process.env.NAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  host: process.env.DB_HOST ?? '',
  port: Number(process.env.DB_PORT),
  driver: PostgreSqlDriver,
  //debug: true,
  migrations: {
    tableName: 'minhas-migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '*.{js,ts}',
    silent: false,
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false, // disable table dropping for safety
    safe: false,
    snapshot: true,
    emit: 'ts',
    fileName: (timestamp, name) => `${timestamp}_${name || 'migration'}`,
  },
  seeder: {
    path: './seeders',
    pathTs: './seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  extensions: [Migrator, SeedManager],
});
