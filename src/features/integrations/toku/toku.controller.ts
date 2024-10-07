import { Controller } from '@nestjs/common';
import { TokuService } from './toku.service';

@Controller('toku')
export class TokuController {
  constructor(private readonly tokuService: TokuService) {}
}
