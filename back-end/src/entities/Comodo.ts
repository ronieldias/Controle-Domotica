
// entities/Categoria.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Dispositivo } from "./Dispositivo";

@Entity()
export class Comodo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string;

    @OneToMany(() => Dispositivo, dispositivo => dispositivo.comodo)
    dispositivos!: Dispositivo[];
    
    constructor(nome: string) {
        this.nome = nome;
    }
}