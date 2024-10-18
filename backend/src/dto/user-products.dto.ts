import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class ProductInfo {
  @Field()
  productName: string;

  @Field(() => Int)
  productPrice: number;

  @Field(() => Int)
  productStock: number;
}

@ObjectType()
class OrderInfo {
  @Field(() => Int)
  orderId: number;

  @Field()
  orderDate: string;

  @Field(() => [ProductInfo])
  products: ProductInfo[];
}

@ObjectType()
export class UserProductsDto {
  @Field(() => [OrderInfo])
  orders: OrderInfo[];
}
