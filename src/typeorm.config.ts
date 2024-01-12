import { DataSource, DataSourceOptions } from 'typeorm';
import * as config from 'config';
const dbConfig = config.get('jwt');
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres' || dbConfig.type,
  host: process.env.POSTGRES_HOST || dbConfig.host,
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres!',
  database: process.env.POSTGRES_DB || 'exchangedb',
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  migrationsRun: false,
  migrationsTableName: 'migration',
  migrations: [
    __dirname + '/migration/**/*.ts',
    __dirname + '/migration/**/*.js',
  ],
  logging: true,
  synchronize: true,
};

let dataSource = new DataSource(dataSourceOptions);
export default dataSource;
