import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express';
import { stat } from "fs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        const status = exception.getStatus();

        const response = exception.getResponse();

        let message: string;

        if (typeof response === 'object' && response !== null) {
          const resObj: any = response;
          if (Array.isArray(resObj.message)) {
            message = resObj.message.join(', ');
          } else {
            message = resObj.message || 'Internal server error!';
          }
        } else {
          message = response || 'Internal server error!';
        }
    
        res.status(status).json({
          status: 'failed',
          message,
          data: null
        });
}
}