import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Comodo } from "./Comodo";
import { Acao } from "./Acao";

@Entity()
export class Dispositivo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string;

    @Column({ default: false })
    estado: boolean;

    @ManyToOne(() => Comodo, comodo => comodo.dispositivos, { eager: true })
    comodo!: Comodo;

    @OneToMany(() => Acao, acao => acao.dispositivo, { cascade: true })
    acoes!: Acao[];

    constructor(nome: string, comodo: Comodo) {
        this.nome = nome;
        this.comodo = comodo;
        this.estado = false;
    }

    ligar(): void {
        this.estado = true;
    }

    desligar(): void {
        this.estado = false;
    }
}