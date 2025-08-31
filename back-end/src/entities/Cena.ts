import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Acao } from "./Acao";

@Entity()
export class Cena {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string;

    @Column({ default: true })
    habilitar: boolean;

    @Column({ default: false })
    ativar: boolean;

    @OneToMany(() => Acao, acao => acao.cena)
    acoes!: Acao[];

    constructor(nome: string) {
        this.nome = nome;
        this.habilitar = true;
        this.ativar = false;
    }
    
    habilitar_cena(): void {
        this.habilitar = true;
    }

    desabilitar_cena(): void {
        this.habilitar = false;
    }

    ativar_cena(): void {
        if (this.habilitar) {
            this.ativar = true;
        }
    }

    desativar_cena(): void {
        this.ativar = false;
    }
}
