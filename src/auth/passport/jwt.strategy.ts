
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../../users/users.interface';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private rolesService: RolesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_ACCESS_KEY'),
        });
    }
    //decode user
  async validate(payload: IUser) {
    const {_id, name, email, role } = payload

    const userRole = role as unknown as { _id: string , name: string}
    const temp = (await this.rolesService.findOne(userRole._id)).toObject()

    return {
      _id,
      name, 
      email,
      role,
      permissions: temp?.permissions ?? []
    }
  }
}