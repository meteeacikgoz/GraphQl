import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from './product.model';
import { Order } from './order.model';

@ObjectType()
export class OrderProducts {
  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Product, { nullable: true }) // İlişki
  product?: Product;

  @Field(() => Order, { nullable: true }) // İlişki
  order?: Order;
}
