import { Catch } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter {
    catch(exception: any, host: any) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus ? exception.getStatus() : 500;

        response.status(status).json({
            status: 'failed',
            message: exception.message || 'Internal server error',
            error: exception.response?.error || 'Internal Server Error',
        });
    }
}