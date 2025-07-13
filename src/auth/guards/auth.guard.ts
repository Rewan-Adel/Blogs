import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC } from "src/common/decorators/public.decorator";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            context.getHandler(), context.getClass()
        ])
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException()
        }

        try{
            let payload = this.jwtService.verify(token);
            if(!payload || !payload.id){
                throw new UnauthorizedException()
            }

            const user = await this.userService.findUserById(payload.id);
            if(!user || !user.isActive){
                throw new UnauthorizedException()
            }
            payload = {
                id : user.id,
                email: user.email,
                role: user.role
            }
            request['user'] = payload;
        }catch (error) {
            throw new UnauthorizedException()
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | null {
        const [type, token] = request.headers.authorization?.split(' ') || [];
        return type === 'Bearer' ? token : null;
    }
}