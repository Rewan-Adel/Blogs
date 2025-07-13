import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dtos/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signup(userDto: CreateUserDTO) {
        userDto.password = await this.hashPassword(userDto.password);
        const user = await this.usersService.createUser(userDto);
        const { password, ...result } = user;

        const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
        return { ...result, accessToken };
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user || !(await this.comparePasswords(password, user.password))) {
            throw new BadRequestException('Invalid email or password');
        }
        
        const { password: userPassword, ...result } = user;
        const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
        return { ...result, accessToken };
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
