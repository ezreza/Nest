import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prisma.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        property_type: true,
        listed_date: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    });
    return homes.map((home) => new HomeResponseDto(home));
  }

  getHome(id: number) {
    return this.prisma.home.findFirstOrThrow({
      where: {
        id: id,
      },
    });
  }

  createHome({
    address,
    number_of_bedrooms,
    number_of_bathrooms,
    city,
    price,
    property_type,
    relator_id,
  }: CreateHomeDto) {
    return this.prisma.home.create({
      data: {
        address,
        number_of_bedrooms,
        number_of_bathrooms,
        city,
        price,
        property_type,
        relator_id,
      },
    });
  }
}
