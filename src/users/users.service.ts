import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dtos/update-user-dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async createUser(createUserDto: CreateUserDTO) {
        const existingUser = await this.findUserByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
        }
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    };

    async findUserByEmail(email: string) {
        return  await this.userRepository.findOneBy({ email });;
    };

    async findUserById(userId: number) {
        return await this.userRepository.findOneBy({ id: userId });
    };

    async findAllUsers() {
        return await this.userRepository.find();
    };


    async updateUser(id: number, updateUserDto: UpdateUserDTO) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new BadRequestException(`User with id ${id} not found`);
        }
        return await this.userRepository.update(id, updateUserDto);
    };

    async deleteUser(id: number) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new BadRequestException(`User with id ${id} not found`);
        }
        return await this.userRepository.remove(user);
    };

    async uploadProfilePicture(userId: number, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File must be provided');
        }

        const user = await this.findUserById(userId);
        if (!user) {
            throw new BadRequestException(`User with id ${userId} not found`);
        }
        user.image = file.buffer.toString('base64');
        if (!user.image) {
            throw new Error('Image upload failed');
        }
        return await this.userRepository.save(user);
    }
}
