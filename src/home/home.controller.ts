import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from './dtos/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHome(@Param('id') id: number) {
    return this.homeService.getHome(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return '';
  }
}
