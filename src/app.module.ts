import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { SeedsModule } from './seeds/seeds.module';
import { SeedsService } from './seeds/seeds.service';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.development.env`,
  }),
    DatabasesModule, UsersModule, AuthModule, SeedsModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService, SeedsService],
})

export class AppModule {}
