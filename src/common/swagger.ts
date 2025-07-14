import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerBuilding(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Blog API')
        .setDescription('API documentation for the Blog application')
        .setVersion('1.0')
        .build();   

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
}