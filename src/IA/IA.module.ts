import { Module } from '@nestjs/common';
import { IAService } from './IA.service';
import { IAController } from './IA.controller';

@Module({
  controllers: [IAController],
  providers: [IAService],
  exports: [IAService],
})
export class IAModule {}
