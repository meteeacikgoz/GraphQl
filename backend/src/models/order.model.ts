import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.model'; // User modelini içe aktarın
import { OrderProducts } from './orderProducts.model'; // OrderProducts modelini içe aktarın

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field()
  orderDate: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => User) // User ilişkisi
  user: User; // Burada user alanının tipi User olmalı

  @Field(() => [OrderProducts], { nullable: true }) // Product ilişkisi
  products: OrderProducts[]; // Burada OrderProducts dizisi
}
