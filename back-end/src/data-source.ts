// data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Acao } from "./entities/Acao";
import { Cena } from "./entities/Cena";
import { Comodo } from "./entities/Comodo";
import { Dispositivo  } from "./entities/Dispositivo";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "smarthouse_db",
    synchronize: true,
    logging: false,
    entities: [Acao, Cena, Comodo, Dispositivo],
});