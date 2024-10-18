import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OrderProducts } from './orderProducts.model';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => [OrderProducts], { nullable: true }) // OrderProducts dizisi
  orders?: OrderProducts[];
}
