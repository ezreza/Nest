import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
// import { PropertyType } from 'src/generated/prisma/enums';

interface GetHomeParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propetyType?: PropertyType;
}

interface CreateHomeParam {
  address: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  city: string;
  price: number;
  images: { url: string }[];
  property_type: PropertyType;
}

interface UpdateHomeParam {
  address?: string;
  number_of_bedrooms?: number;
  number_of_bathrooms?: number;
  city?: string;
  price?: number;
  property_type?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomes(filters: GetHomeParam): Promise<HomeResponseDto[]> {
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
        images: true,
      },
      where: filters,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map(
      (home) =>
        new HomeResponseDto({
          ...home,
          image: home.images[0]?.url,
        }),
    );
  }

  async getHome(id: number) {
    const home = await this.prisma.home.findUnique({
      where: {
        id: id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    number_of_bedrooms,
    number_of_bathrooms,
    city,
    price,
    images,
    property_type,
  }: CreateHomeParam) {
    const home = await this.prisma.home.create({
      data: {
        address,
        number_of_bedrooms,
        number_of_bathrooms,
        city,
        price,
        property_type,
        relator_id: 5,
      },
    });

    const homeImage = images.map((image) => ({
      url: image.url,
      home_id: home.id,
    }));
    await this.prisma.image.createMany({ data: homeImage });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, data: UpdateHomeParam) {
    const home = await this.prisma.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    const updateHome = await this.prisma.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDto(updateHome);
  }

  async deleteHome(id: number) {
    await this.prisma.image.deleteMany({
      where: {
        home_id: id,
      },
    });

    await this.prisma.home.delete({
      where: {
        id,
      },
    });

    return 'home deleted successfuly';
  }
}
