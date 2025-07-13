import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dtos/create-articles-dto';
import { UpdateArticleDto } from './dtos/update-articles-dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createArticle(createArticleDto: CreateArticleDto, authorId: number) {
        const author = await this.userRepository.findOneBy({ id: authorId });
        if (!author) {
            throw new Error(`Author with id ${authorId} not found`);
        }
        const article = this.articleRepository.create({ ...createArticleDto, author });
        return await this.articleRepository.save(article);
    }

    async findAllArticles() {
        return await this.articleRepository.find({ relations: ['author'] });
    }

    async findArticleById(id: number, isPublished: boolean | null = null) {
        if (isPublished === null) {
            return await this.articleRepository.findOne({ where: { id }, relations: ['author'] });
        }
        return await this.articleRepository.findOne({ where: { id, isPublished }, relations: ['author'] });
    }

    async updateArticle(id: number, updateArticleDto: UpdateArticleDto, authorId: number) {
        const article = await this.findArticleById(id);
        if (!article) {
            throw new Error(`Article with id ${id} not found`);
        }
        if (authorId) {
            const author = await this.userRepository.findOneBy({ id: authorId });
            if (!author) {
                throw new Error(`Author with id ${authorId} not found`);
            }
            article.author = author;
        }
        return await this.articleRepository.update(id, updateArticleDto);
    }

    async deleteArticle(id: number) {
        const article = await this.findArticleById(id);
        if (!article) {
            throw new Error(`Article with id ${id} not found`);
        }
        return await this.articleRepository.remove(article);
    }

    async findArticlesByAuthor(authorId: number, isPublished: boolean|null = null) {
        if (isPublished === null) {
            return await this.articleRepository.find({ where: { author: { id: authorId } } });
        }
        return await this.articleRepository.find({ where: { author: { id: authorId }, isPublished }, relations: ['author'] });
    }

    async findPublishedArticles() {
        return await this.articleRepository.find({ where: { isPublished: true }, relations: ['author'] });
    }

}
