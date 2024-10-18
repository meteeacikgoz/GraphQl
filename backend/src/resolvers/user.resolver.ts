import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { PrismaService } from '../prisma.service';
import { UserProductsDto } from 'src/dto/user-products.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { orders: { include: { products: true } } }, // Siparişlerin ürünlerini dahil et
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      orders:
        user.orders.map((order) => ({
          ...order,
          user: { id: user.id, name: user.name, email: user.email }, // Kullanıcı bilgisini ekle
        })) || [], // Kullanıcıya ait siparişleri burada doldurun.
    }));
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: { orders: { include: { products: true } } }, // Siparişlerin ürünlerini dahil et
    });

    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          orders:
            user.orders.map((order) => ({
              ...order,
              user: { id: user.id, name: user.name, email: user.email }, // Kullanıcı bilgisini ekle
            })) || [], // Kullanıcıya ait siparişleri burada doldurun.
        }
      : null;
  }

  @Query(() => UserProductsDto)
  async userProducts(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<UserProductsDto> {
    const userOrders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    const orders = userOrders.map((order) => ({
      orderId: order.id,
      orderDate: order.orderDate.toISOString(), // Date'yi string formatına çeviriyoruz
      products:
        order.products.map((product) => ({
          productName: product.product.name,
          productPrice: product.product.price,
          productStock: product.product.stock,
        })) || [],
    }));

    return { orders };
  }

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
  ): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      orders: [],
    };
  }
}
