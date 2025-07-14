import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "src/comments/entities/comment.entity";

@Entity('articles')
export class Article{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: true })
    isPublished: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
   
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    
    @ManyToOne(() => User, user => user.articles, {
        onDelete: 'CASCADE', // If the user is deleted, their articles will also be deleted
        cascade: true,
    })
    author: User;

    @OneToMany(() => Comment, comment => comment.article,{
        onDelete: 'CASCADE', // If the article is deleted, its comments will also be deleted
        cascade: true,
    })
    comments: Comment[];
}