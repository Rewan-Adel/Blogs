import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { error } from "console";
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const status   = exception.getStatus() ? exception.getStatus() : 500;
        const exceptionResponse = exception.getResponse();
        const message =
        typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

     console.error('Exception caught:', exceptionResponse); 
        response.status(status).json({
            status: 'failed',
            message: exception.message || 'Internal server error!',
            error :  exceptionResponse
        });
    }
}