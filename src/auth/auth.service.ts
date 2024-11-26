import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.interface';
@Injectable()
export class AuthService {
    constructor(
        private usesrService:UsersService,
        private jwtService:JwtService
    ){}
    //check user and password 
    async validateUser(username:string,pass:string):Promise<any>{
            const user = await this.usesrService.findOnebyUsername(username);
 
            if(user){
           const isValid = await this.usesrService.checkUserPassword(pass,user.password)
            if(isValid){
                const {password,...result} = user.toObject()
                return result; 
                }
            }
            return null
    }
    //sign and return access_token
    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: 'Tokeb login',
            iss: 'From server',
            _id,
            name,
            email,
            role
        };
        return {
          access_token: this.jwtService.sign(payload),
          _id,
          name,
          email,
          role
        };
      }
    
    
}
