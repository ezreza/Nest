import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from 'src/generated/prisma/enums';

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
  constructor(private readonly prisma: PrismaService) {}

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

    return this.generateJWT(user.id, user.name);
  }

  async login({ email, password }: loginParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credint');
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credint');
    }

    return this.generateJWT(user.id, user.name);
  }

  /**
   *
   * @param id
   * @param name
   * @returns
   */
  private generateJWT(id: number, name: string) {
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new ForbiddenException('JWT secret key is not defined');
    }

    return jwt.sign({ id: id, name: name }, jwtSecret, {
      expiresIn: '7d',
    });
  }
}
