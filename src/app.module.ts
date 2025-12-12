import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: await configService.get('DB_HOST'),
        port: await configService.get('DB_PORT'),
        username: await configService.get('DB_NAME'),
        password: await configService.get('DB_PASSWORD'),
        database: await configService.get('DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    ConfigModule,
    TasksModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [ConfigService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
