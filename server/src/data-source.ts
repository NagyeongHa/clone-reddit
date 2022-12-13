import "reflect-metadata";
import { DataSource, Entity } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: [],
  subscribers: [],
});
