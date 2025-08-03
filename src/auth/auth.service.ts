import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { hashSync, compareSync } from 'bcrypt'

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto, UpdateAuthDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
      @InjectRepository( User )
      private readonly userRepository: Repository<User>,

      private readonly jwtService: JwtService,
    ) {}

  async createUser( createUserDto: CreateUserDto ) {
    // Check if the user already exists
    try {

      const { password, ...userDetails } = createUserDto;

      const user = this.userRepository.create({
        ...userDetails,
        password: hashSync( password, 10 ),
      });
      
      await this.userRepository.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
        // token: this.getJwtToken({ email: user.email })
      };

    } catch (error) {

      this.handleDBErrors(error);

    }

  }

  async loginUser( loginUserDto: LoginUserDto ) {

    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true } // Only select the fields we need
      });

      if ( !user ) throw new UnauthorizedException('Invalid credentials (email)');

      if ( compareSync( password, user.password ) === false ) throw new UnauthorizedException('Invalid credentials (password)');

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
        // token: this.getJwtToken({ email: user.email })
      };
      
    } catch (error) {
      this.handleDBErrors(error);
      
    }
  }

  async checkAuthStatus( user: User ) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
      // token: this.getJwtToken({ email: user.email })
    };

  }

  private getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign( payload );

    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException( error.detail );
    }
    
    console.log(error);
    
    throw new InternalServerErrorException('Please check server logs');
  }

}
