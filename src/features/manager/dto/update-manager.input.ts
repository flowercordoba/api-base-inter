import { CreateManagerInput } from './create-manager.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateManagerInput extends PartialType(CreateManagerInput) {
  @Field(() => Int)
  id: number;
}
