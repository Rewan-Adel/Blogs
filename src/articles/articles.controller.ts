import { Body, Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-articles-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles-enum';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ){}
 
    @Post()
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
        @CurrentUser() user: any 
    ) {
        return this.articlesService.createArticle(createArticleDto, user.id);
    }

    // Get all articles for admins
    @Get('admin')
    @Roles([UserRole.ADMIN])

    @ApiOperation({ summary: 'Get all articles' })
    @ApiResponse({ status: 200, description: 'Return all articles.' })
    async findAllArticles() {
        return this.articlesService.findAllArticles();
    }
    @Roles([UserRole.ADMIN])
    @Get('/admin/author/:authorId')
    async findArticlesByAuthor(@Param('authorId') authorId: number) {
        return this.articlesService.findArticlesByAuthor(authorId);
    }


    // Get article by ID for public access
    @Public()
    @Get(':id')
    async findArticleById(@Param('id') id: number) {
        return this.articlesService.findArticleById(id);
    }
    // Get published articles by author for public access
    @Public()
    @Get('author/:authorId/published')
    async findPublishedArticlesByAuthor(@Param('authorId') authorId: number) {
        return this.articlesService.findArticlesByAuthor(authorId, true);
    }

    // Get all articles by the current user
    @Roles([UserRole.USER])
    @Get('/all/my-articles')
    async findAllArticlesByCurrentUser(
        @CurrentUser() user: any,
        @Query('isPublished') isPublished: boolean | null = null
    ) {
        return this.articlesService.findArticlesByAuthor(user.id, isPublished);
    }
   
     
    @Delete(':id')
    async deleteArticle(@Param('id') id: number) {
        return this.articlesService.deleteArticle(id);
    }

}
