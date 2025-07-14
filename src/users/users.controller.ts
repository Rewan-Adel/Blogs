import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-roles-enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: 'Create a new user by admin' })
    

    async createUser(
        @Body() createUserDto: CreateUserDTO) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    @SetMetadata('message', 'Fetching all users')
    async getUsers(){
        return await this.usersService.findAllUsers();
    }

    @Get(':id')
    async getOneUser(@Param(
        'id',
        new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })
    ) id: number){
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    @Delete(':id')
    async deleteOneUser(
        @Param('id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
            })
        ) id: number
    ){
        return await this.usersService.deleteUser(id);
    }

    @Patch(':id')
    async updateUser(
        @Param('id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
            })
        ) id: number,
        @Body() userData: UpdateUserDTO
    ){
        return await this.usersService.updateUser(id, userData);
    }

    @Get('/get/profile')
    async getProfile(@CurrentUser() user: any) {
        return this.usersService.findUserById(user.id);
    }
}