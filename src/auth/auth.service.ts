import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private usesrService:UsersService,
        private jwtService:JwtService
    ){}

    async validateUser(username:string,pass:string):Promise<any>{
            const user = await this.usesrService.findOnebyUsername(username);
            if(user){
           const isValid = this.usesrService.checkUserPassword(pass,user.password)
            if(isValid){
                const {password,...result} = user
                return result; 
                }
            }
            return null
    }
    async login(user: any) {
        const payload = { 
            username: user.email, 
            sub: user._id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    
    
}
