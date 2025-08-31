import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Dispositivo } from "./Dispositivo";
import { Cena } from "./Cena";

@Entity()
export class Acao {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ordem: number;

    @ManyToOne(() => Dispositivo, dispositivo => dispositivo.acoes, { eager: true })
    dispositivo!: Dispositivo;

    @ManyToOne(() => Cena, cena => cena.acoes, { onDelete: "CASCADE" })
    cena!: Cena;

    constructor(ordem: number, dispositivo: Dispositivo, cena: Cena) {
        this.ordem = ordem;
        this.dispositivo = dispositivo;
        this.cena = cena;
    }
}