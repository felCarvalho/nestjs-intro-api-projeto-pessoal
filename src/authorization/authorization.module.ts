import { Module } from '@nestjs/common';
import { RolesPermissionsRepositoryContract } from './contracts/permissions.contracts';
import { ModuleCore } from '../shared/core/moduleCore/module.core';

@Module({
  imports: [ModuleCore],
  controllers: [],
  providers: [],
})
export class AuthorizationModule {}
