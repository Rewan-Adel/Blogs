import { EntityManager } from "typeorm";
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
    await seedUser();
    await seedArticle();

    async function seedUser(){
        const hashedPassword = await bcrypt.hash('123456', 10);
        for (let i = 0; i < 5; i++) {
            const user = new User();
            user.username = faker.person.fullName();
            user.email = faker.internet.email();

            user.password = hashedPassword;
            await manager.save(user);
        }
    }

    async function seedArticle() {
        const articles = [];
        for (let i = 0; i < 10; i++) {
            const article = new Article();
            article.title = faker.lorem.sentence();
            article.content = faker.lorem.paragraphs(3);
            article.isPublished = faker.datatype.boolean();

            const user = await manager.findOne(User, { where: { id: faker.number.int({ min: 1, max: 500 }) } });
            if (!user) {
                console.error('User not found');
                continue;
            }
            article.author = user;
            await manager.save(article);
        }
    }
  
};
