import { Exclude, Expose } from 'class-transformer';

export class AuthResponseDto {
  id: number;

  name: string;
  phone: string;
  email: string;

  @Exclude()
  user_type: string;

  @Expose({ name: 'userType' })
  userType() {
    return this.user_type;
  }

  @Exclude()
  password: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
