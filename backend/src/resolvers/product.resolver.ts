import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product } from '../models/product.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id') id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: { orders: true }, // Siparişleri dahil et
    });

    return product
      ? {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          orders: product.orders || [], // Başlangıçta sipariş yok
        }
      : null;
  }
  @Query(() => [String])
  async productUser(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<string[]> {
    const userOrders = await this.prisma.orderProducts.findMany({
      where: { productId },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    const userNames = userOrders
      .map((orderProduct) => {
        return orderProduct.order?.user?.name; // Siparişe ait kullanıcı ismini al
      })
      .filter((name) => name !== undefined); // undefined olanları filtrele

    return userNames;
  }
  @Mutation(() => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('stock') stock: number,
  ): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        name,
        price,
        stock,
      },
    });

    return {
      id: createdProduct.id,
      name: createdProduct.name,
      price: createdProduct.price,
      stock: createdProduct.stock,
      orders: [], // Başlangıçta sipariş yok
    };
  }
}
