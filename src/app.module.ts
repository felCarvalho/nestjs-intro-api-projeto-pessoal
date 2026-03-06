import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import defineConfig from './config/mikro-orm.config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { CategoryModule } from './category/category.module';
import { CreateTaskOrquestradorModule } from './shared/orquestador/create-task/create-task.module';
import { CreateUserOrquestradorModule } from './shared/orquestador/create-user/create-user.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    CategoryModule,
    CreateTaskOrquestradorModule,
    CreateUserOrquestradorModule,
    AuthModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...defineConfig,
        autoLoadEntities: true,
      }),
      driver: PostgreSqlDriver,
    }),
  ],
  controllers: [],
  providers: [ConfigService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Isso garante que cada request tenha seu próprio 'fork' do EntityManager
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
