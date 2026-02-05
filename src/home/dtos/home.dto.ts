import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PropertyType } from 'src/generated/prisma/enums';

export class HomeResponseDto {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;
  price: number;

  @Exclude()
  property_type: PropertyType;
  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Exclude()
  relator_id: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CreateHomeDto {
  @IsString()
  address: string;

  @IsNumber()
  number_of_bedrooms: number;

  @IsNumber()
  number_of_bathrooms: number;

  @IsString()
  city: string;

  @IsNumber()
  price: number;

  @IsEnum(PropertyType)
  property_type: PropertyType;

  @IsNumber()
  relator_id: number;
}
