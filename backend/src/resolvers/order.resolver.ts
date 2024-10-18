import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
} from '@nestjs/graphql';
import { Order } from '../models/order.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        user: true,
        products: {
          include: {
            product: true, // Ürün bilgilerini de dahil et
          },
        },
      },
    });
  }
  @Query(() => Order, { nullable: true })
  async order(@Args('id') id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        products: {
          include: {
            product: true, // Ürün bilgilerini de dahil et
          },
        },
      },
    });
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('userId') userId: number,
    @Args('productIds', { type: () => [Int] }) productIds: number[],
  ): Promise<Order> {
    const order = await this.prisma.order.create({
      data: {
        userId,
        products: {
          create: productIds.map((productId) => ({
            productId,
          })),
        },
      },
      include: {
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }
}
