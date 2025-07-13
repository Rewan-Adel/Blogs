import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user-dto';
import { LoginDto } from 'src/users/dtos/login-dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('signup')
    @Public()
    async signup(@Body() createUserDto: CreateUserDTO) {
        return await this.authService.signup(createUserDto);
    }

    @Post('login')
    @Public()
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto.email, loginDto.password);
    }
}
