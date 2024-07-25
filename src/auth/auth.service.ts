import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
    constructor(private usesrService:UsersService){}

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

    
}
