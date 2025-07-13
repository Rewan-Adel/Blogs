import { DataSource } from "typeorm";


export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'your_database',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    migrationsRun: true,
    
});
