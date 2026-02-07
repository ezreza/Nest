import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '@prisma/client';

interface registerParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface loginParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, phone, password }: registerParams) {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    return this.generateJWT(user.id);
  }

  async login({ email, password }: loginParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return this.generateJWT(user.id);
  }

  /**
   *
   * @param id
   * @returns
   */
  private async generateJWT(id: number) {
    const payload = { sub: id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
