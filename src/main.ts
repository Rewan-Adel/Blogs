import { NestFactory } from '@nestjs/core';
import { AppModule }    from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

import compression from 'compression';
import * as morgan from 'morgan';
import helmet from 'helmet';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(morgan('combined'));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  
  if (configService.get('NODE_ENV') === 'production') {
    app.use(compression()); 
  }

  //Response and Exception Handling
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());

  //Fake Data Seeding
  // const seedsService = app.get(SeedsService);
  // seedsService.seedDatabase();

  await app.listen(configService.get<number>("PORT") ?? 3000);
  console.log(`Server is running in ${configService.get('NODE_ENV')} mode`);
}
bootstrap();
