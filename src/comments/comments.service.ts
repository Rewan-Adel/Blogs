import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { UpdateCommentDto } from './dtos/update-comment-dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly articleService: ArticlesService
    ){}

    async create(userId: number, commentData: CreateCommentDto): Promise<Comment> {
        const article = await this.articleService.findArticleById(commentData.articleId, true);
        if (!article) {
            throw new NotFoundException('Article not found or not published');
        }
        const comment = this.commentRepository.create({ ...commentData, article, user: { id: userId } });
        return this.commentRepository.save(comment);
    }


    // Method to get all comments for a published article
    async findAllArticleComments(articleId: number): Promise<Comment[]> {
        const article = await this.articleService.findArticleById(articleId, true);
        if (!article) {
            throw new NotFoundException('Article not found or not published');
        }
        
        return this.commentRepository.find({ 
            where: { article: { id: articleId } },
            relations: ['user', 'article'] 
        });
    }

    async findCommentById(id: number): Promise<Comment> {
        const comment = await this.commentRepository.findOne({ 
            where: { id },
            relations: ['user', 'article'] 
        });
        
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const article = await this.articleService.findArticleById(comment.article.id, true);
        if (!article) {
            throw new NotFoundException('This article not found or not published');
        }
        return comment;
    }

    async updateComment(userId: number, id: number, updateData: UpdateCommentDto) {
        console.log('Update Comment Data:', updateData);
        const comment = await this.commentRepository.findOne({ 
            where: {
                id,
                user: { id: userId }
            },
            relations: ['user', 'article']
        });
        if (!comment) {
            throw new NotFoundException('Comment not found or you do not have permission to update it');
        }
        return this.commentRepository.update(id, updateData);;
    }
    
    async deleteComment(userId: number, id: number): Promise<void> {
        const comment = await this.commentRepository.findOne({ 
            where: {
                id,
                user: { id: userId }
            },
            relations: ['user', 'article']
        });
        if (!comment) {
            throw new NotFoundException('Comment not found or you do not have permission to delete it');
        }
        this.commentRepository.remove(comment);
        return;
    }
}
