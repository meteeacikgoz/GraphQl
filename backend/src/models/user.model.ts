import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from './order.model'; // Order modelini içe aktarın

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [Order], { nullable: true }) // Order dizisi
  orders?: Order[]; // Burada Order tipini kullan
}
