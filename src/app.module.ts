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
import { CreateRotinaOrquestradorModule } from './shared/orquestador/create-rotina/create-rotina.module';
import { CreateUserOrquestradorModule } from './shared/orquestador/create-user/create-user.module';
import { AuthModule } from './authentication/auth.module';
import { GetAllTaskCategoryRascunhoModule } from './shared/orquestador/get-all-task-category-rascunho/get-all-task-category-rascunho.module';
import { GetAllTaskCategoryActiveOrquestrador } from './shared/orquestador/get-all-task-category-active/get-all-task-category-active.orquestrador';
import { UpdateCategoryTaskOrquestradorModule } from './shared/orquestador/update-status-category-task/update-status-category-task.module';
import { DeleteAllCategoryTaskOrquestradorModule } from './shared/orquestador/delete-all-category-task/delete-all-category-task.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    CategoryModule,
    CreateRotinaOrquestradorModule,
    CreateUserOrquestradorModule,
    AuthModule,
    GetAllTaskCategoryRascunhoModule,
    UpdateCategoryTaskOrquestradorModule,
    DeleteAllCategoryTaskOrquestradorModule,
    GetAllTaskCategoryActiveOrquestrador,
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...defineConfig,
        dbName: configService.get<string>('DATABASE'),
        user: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
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
