
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      //inject reflector
        super();
      }
      //check if the route is public or not

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        
        return super.canActivate(context);
      }
    
      handleRequest(err, user, info) {
        //if error or user is not found
        if (err || !user) {
          throw err || new UnauthorizedException("Token is not valid");
        }
        return user;
      }
}
