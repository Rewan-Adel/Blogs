import { Controller, Body, Post, Get, Param, Patch, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { Comment } from './entities/comment.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateCommentDto } from './dtos/update-comment-dto';
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async create(
        @Body() commentData: CreateCommentDto,
        @CurrentUser() user: any
    ): Promise<Comment> {
        return this.commentsService.create(user.id, commentData);
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Comment> {
        return this.commentsService.findCommentById(id);
    }

    @Get('article/:articleId')
    async findAll(
        @Param('articleId', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) articleId: number): Promise<Comment[]> {
        return this.commentsService.findAllArticleComments(articleId);
    }

    @Patch(':id')
    async update(
        @CurrentUser() user: any,
        @Param('id', 
            new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
        ) id: number,
        @Body() updateData: UpdateCommentDto,
    ) {
        return this.commentsService.updateComment(user.id, id, updateData);
    }

    @Delete(':id')
    async remove(
        @CurrentUser() user: any,
        @Param('id') id: number
    ): Promise<void> {
        return this.commentsService.deleteComment(user.id, id);
    }
}
