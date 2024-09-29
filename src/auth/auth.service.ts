import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
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
           const isValid = this.usesrService.checkUserPassword(pass,user.password)
            if(isValid){
                const {password,...result} = user
                return result; 
                }
            }
            return null
    }
    //sign and return access_token
    async login(user: IUser) {
        
        const payload = { 
            username: user.email,
            name:user.name,
            role:user.role, 
            sub: "token login",
            iss: "from server"
            
        };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    
    
}
