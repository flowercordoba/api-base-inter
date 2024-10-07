import { Injectable } from '@nestjs/common';
import { CreateManagerInput } from './dto/create-manager.input';
import { UpdateManagerInput } from './dto/update-manager.input';

@Injectable()
export class ManagerService {
  create(createManagerInput: CreateManagerInput) {
    return 'This action adds a new manager';
  }

  findAll() {
    return `This action returns all manager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerInput: UpdateManagerInput) {
    return `This action updates a #${id} manager`;
  }

  remove(id: number) {
    return `This action removes a #${id} manager`;
  }
}
