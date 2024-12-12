
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from '../../decorator/customize' 

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
        // if not public, call super.canActivate to check if user is authenticated
        return super.canActivate(context);
      }
    
      handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request  = context.switchToHttp().getRequest()
        
        const isSkipPermission = this.reflector.getAllAndOverride<Boolean>(IS_PUBLIC_PERMISSION, [
          context.getHandler(),
          context.getClass()
        ])

        //if error or user is not found
        if (err || !user) {
          throw err || new UnauthorizedException("Token is invalid or expired");
        }
        
        //check permissions
        const targetMethod = request.method;
        const targetEndpoint = request.route.path as string;
        const permissions = user?.permissions ?? [];

        let canAccess = permissions.some(permission =>
          targetMethod === permission.method &&
          targetEndpoint === permission.apiPath
      );

        if (targetEndpoint.startsWith('/api/v1/auth')) canAccess = true;

        if(!canAccess && !isSkipPermission)
        {
          throw new ForbiddenException('You are not allow to access this endpoint')
        }

        return user;
      }
}
 