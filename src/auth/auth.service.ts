import { BadGatewayException, BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.interface';
import { genSaltSync, hashSync } from 'bcryptjs';
import { RegisterDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
    constructor(
        private usesrService:UsersService,
        private jwtService:JwtService,
        private configService: ConfigService
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
    async login(user: IUser,response: Response) {

        const { _id, name, email, role } = user;
        const payload = {
            sub: 'Token login',
            iss: 'From server',
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)
    
        await this.usesrService.updateUserToken(refresh_token,_id)

        response.cookie('refresh_token', refresh_token, { 
            httpOnly:true,
            maxAge:ms(this.configService.get<string>('JWT_ACCESS_EXPIRE'))
        })

        return {
          access_token: this.jwtService.sign(payload),
          user:{
            _id,
            name,
            email,
            role
          }
        };
      }
    async register(registerDto:RegisterDto){
        let result = await this.usesrService.register(registerDto)
        const {_id, createdAt} = result
        return{
            _id,
            createdAt
        }
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_KEY"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000
        })
        return refresh_token
    }
    
    processNewToken = async (refeshToken: string,response:Response) => {
        try{
       this.jwtService.verify(refeshToken , {
                secret: this.configService.get<string>("JWT_REFRESH_KEY ")
            })
            let user = await this.usesrService.findUserByToken(refeshToken)
            if(!user){
                throw new BadRequestException('Refreshtoken is invalid')
            }
            const { _id, name, email, role } = user;
            const payload = {
                sub: 'Token login',
                iss: 'From server',
                _id,
                name,
                email,
                role
            };
    
            const refresh_token = this.createRefreshToken(payload)
        
            await this.usesrService.updateUserToken(refresh_token,_id.toString())
            response.clearCookie("refresh_token")
            response.cookie('refresh_token', refresh_token, { 
                httpOnly:true,
                maxAge:ms(this.configService.get<string>('JWT_ACCESS_EXPIRE'))
            })
    
            return {
              access_token: this.jwtService.sign(payload),
              user:{
                _id,
                name,
                email,
                role
              }
            };
        }catch(err){
            throw new BadRequestException('`Refreshtoken is invalid')
        }
    }

    async logout(response: Response, user: IUser){
        await this.usesrService.updateUserToken(null, user._id)
        response.clearCookie("refresh_token")
        return "OK"
    }
}
