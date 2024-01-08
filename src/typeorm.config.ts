import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres-db',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres!',
  database: process.env.POSTGRES_DB || 'exchangedb',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
