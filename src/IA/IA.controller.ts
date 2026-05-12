import { Controller } from '@nestjs/common';
import { IAService } from './IA.service';
import { IADto } from './IA.dto';

@Controller()
export class IAController {
  constructor(private readonly iaService: IAService) {}
}
