// index.ts
import express from "express";
import { AppDataSource } from "./data-source";
import { Acao } from "./entities/Acao";
import { Cena } from "./entities/Cena";
import { Comodo } from "./entities/Comodo";
import { Dispositivo } from "./entities/Dispositivo";

const app = express();
app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log("Conectado ao banco!");

    // ######################################## ENDPOINTS  ########################################
    // [CREATE] Comodo
    app.post("/comodos", async (req, res) => {
        const { nome } = req.body;
        const comodo = new Comodo(nome);
        await AppDataSource.getRepository(Comodo).save(comodo);
        res.json(comodo);
    });

    // [[READ]] COMODOS
    app.get("/comodos", async (req, res) => {
        const comodos = await AppDataSource.getRepository(Comodo).find({ relations: ["dispositivos"] });
        res.json(comodos);
    });

    // [[READ]] COMODO POR IR
    app.get("/comodos/:id", async (req, res) => {
        const comodo = await AppDataSource.getRepository(Comodo).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["dispositivos"]
        });
        res.json(comodo);
    });

    // [UPDATE] COMODO
    app.put("/comodos/:id", async (req, res) => {
        const { nome } = req.body;
        await AppDataSource.getRepository(Comodo).update(req.params.id, { nome });
        const comodo = await AppDataSource.getRepository(Comodo).findOneBy({ id: parseInt(req.params.id) });
        res.json(comodo);
    });

    // [DELETE] COMODO
    app.delete("/comodos/:id", async (req, res) => {
        const comodo = await AppDataSource.getRepository(Comodo).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["dispositivos"]
        });
        // validacao
        if (comodo && comodo.dispositivos.length > 0) {
            return res.status(400).json({ erro: "Não é possível deletar cômodo com dispositivos" });
        }
        await AppDataSource.getRepository(Comodo).delete(req.params.id);
        res.json({ sucesso: true });
    });

    // ######################################## CRUD DISPOSITIVO ########################################
    // [CREATE] DISPOSITIVO
    app.post("/dispositivos", async (req, res) => {
        const { nome, comodo_id } = req.body;
        const comodo = await AppDataSource.getRepository(Comodo).findOneBy({ id: comodo_id });
        if (!comodo) return res.status(404).json({ erro: "Cômodo não encontrado" });

        const dispositivo = new Dispositivo(nome, comodo);
        await AppDataSource.getRepository(Dispositivo).save(dispositivo);
        res.json(dispositivo);
    });

    // [READ] DISPOSITIVOS
    app.get("/dispositivos", async (req, res) => {
        const dispositivos = await AppDataSource.getRepository(Dispositivo).find({ relations: ["comodo", "acoes"] });
        res.json(dispositivos);
    });

    // [READ] DISPOSITIVO POR ID
    app.get("/dispositivos/:id", async (req, res) => {
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["comodo", "acoes"]
        });
        res.json(dispositivo);
    });

    // [UPDATE] DISPOSITIVO
    app.put("/dispositivos/:id", async (req, res) => {
        const { nome, estado } = req.body;
        await AppDataSource.getRepository(Dispositivo).update(req.params.id, { nome, estado });
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOneBy({ id: parseInt(req.params.id) });
        res.json(dispositivo);
    });

    // DELETE DISPOSITIVO
    app.delete("/dispositivos/:id", async (req, res) => {
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["acoes"]
        });
        // validacao
        if (dispositivo && dispositivo.acoes.length > 0) {
            return res.status(400).json({ erro: "Não é possível DELETE dispositivo relacionado a uma cena" });
        }
        await AppDataSource.getRepository(Dispositivo).delete(req.params.id);
        res.json({ sucesso: true });
    });

    // ######################################## CRUD CENA ########################################
    // [CREATE] CENA
    app.post("/cenas", async (req, res) => {
        const { nome } = req.body;
        const cena = new Cena(nome);
        await AppDataSource.getRepository(Cena).save(cena);
        res.json(cena);
    });

    // [READ] CENAS
    app.get("/cenas", async (req, res) => {
        const cenas = await AppDataSource.getRepository(Cena).find({ relations: ["acoes", "acoes.dispositivo"] });
        res.json(cenas);
    });

    // [READ] CENA POR ID
    app.get("/cenas/:id", async (req, res) => {
        const cena = await AppDataSource.getRepository(Cena).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["acoes", "acoes.dispositivo"]
        });
        res.json(cena);
    });

    // [UPDATE] CENA
    app.put("/cenas/:id", async (req, res) => {
        const { nome, habilitar, ativar } = req.body;
        await AppDataSource.getRepository(Cena).update(req.params.id, { nome, habilitar, ativar });
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: parseInt(req.params.id) });
        res.json(cena);
    });

    // [DELETE] CENA
    app.delete("/cenas/:id", async (req, res) => {
        // As ações são deletadas automaticamente devido ao cascade
        await AppDataSource.getRepository(Cena).delete(req.params.id);
        res.json({ sucesso: true });
    });

    // ######################################## CRUD ACAO ########################################
    // [CREATE] ACAO
    app.post("/acoes", async (req, res) => {
        const { ordem, dispositivo_id, cena_id } = req.body;
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOneBy({ id: dispositivo_id });
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: cena_id });

        if (!dispositivo) return res.status(404).json({ erro: "Dispositivo não encontrado" });
        if (!cena) return res.status(404).json({ erro: "Cena não encontrada" });

        const acao = new Acao(ordem, dispositivo, cena);
        await AppDataSource.getRepository(Acao).save(acao);
        res.json(acao);
    });

    // [READ] ACOES
    app.get("/acoes", async (req, res) => {
        const acoes = await AppDataSource.getRepository(Acao).find({ relations: ["dispositivo", "cena"] });
        res.json(acoes);
    });

    // ######################################## [ENDPOINTS ADICIONAIS] CENA ########################################
    // HABILITAR CENA
    app.put("/cenas/:id/habilitar", async (req, res) => {
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: parseInt(req.params.id) });
        if (!cena) return res.status(404).json({ erro: "Cena não encontrada" });

        cena.habilitar_cena();
        await AppDataSource.getRepository(Cena).save(cena);
        res.json(cena);
    });

    // DESABILITAR CENA
    app.put("/cenas/:id/desabilitar", async (req, res) => {
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: parseInt(req.params.id) });
        if (!cena) return res.status(404).json({ erro: "Cena não encontrada" });

        cena.desabilitar_cena();
        await AppDataSource.getRepository(Cena).save(cena);
        res.json(cena);
    });

    // ATIVAR CENA
    app.put("/cenas/:id/ativar", async (req, res) => {
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: parseInt(req.params.id) });
        if (!cena) return res.status(404).json({ erro: "Cena não encontrada" });

        if (!cena.habilitar) {
            return res.status(400).json({ erro: "Não é possível ativar uma cena desabilitada" });
        }

        cena.ativar_cena();
        await AppDataSource.getRepository(Cena).save(cena);
        res.json(cena);
    });

    // DESATIVAR CENA
    app.put("/cenas/:id/desativar", async (req, res) => {
        const cena = await AppDataSource.getRepository(Cena).findOneBy({ id: parseInt(req.params.id) });
        if (!cena) return res.status(404).json({ erro: "Cena não encontrada" });

        if (!cena.habilitar) {
            return res.status(400).json({ erro: "Não é possível desativar uma cena desabilitada" });
        }

        cena.desativar_cena();
        await AppDataSource.getRepository(Cena).save(cena);
        res.json(cena);
    });

    // ######################################## [ENDPOINTS ADICIONAIS] DISPOSITIVO ########################################    
    // // LIGAR DISPOSITIVO
    app.put("/dispositivos/:id/ligar", async (req, res) => {
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOneBy({ id: parseInt(req.params.id) });
        if (!dispositivo) return res.status(404).json({ erro: "Dispositivo não encontrado" });

        dispositivo.ligar();
        await AppDataSource.getRepository(Dispositivo).save(dispositivo);
        res.json(dispositivo);
    });

    // DESLIGAR DISPOSITIVO
    app.put("/dispositivos/:id/desligar", async (req, res) => {
        const dispositivo = await AppDataSource.getRepository(Dispositivo).findOneBy({ id: parseInt(req.params.id) });
        if (!dispositivo) return res.status(404).json({ erro: "Dispositivo não encontrado" });

        dispositivo.desligar();
        await AppDataSource.getRepository(Dispositivo).save(dispositivo);
        res.json(dispositivo);
    });

    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
        console.log("Endpoints disponíveis:");

        console.log("  POST   /dispositivos");
        console.log("  GET    /dispositivos");
        console.log("  GET    /dispositivos/:id");
        console.log("  PUT    /dispositivos/:id");
        console.log("  DELETE /dispositivos/:id");
        console.log("  PUT    /dispositivos/:id/ligar");
        console.log("  PUT    /dispositivos/:id/desligar");

        console.log("  POST   /dispositivos/:id/comodo");
        console.log("  GET    /comodos");
        console.log("  GET    /comodos/:id");
        console.log("  PUT    /comodos/:id");
        console.log("  DELETE /comodos/:id");

        console.log("  POST   /cenas");
        console.log("  GET    /cenas");
        console.log("  GET    /cenas/:id");
        console.log("  PUT    /cenas/:id");
        console.log("  DELETE /cenas/:id");
        console.log("  PUT    /cenas/:id/habilitar");
        console.log("  PUT    /cenas/:id/desabilitar");
        console.log("  PUT    /cenas/:id/ativar");
        console.log("  PUT    /cenas/:id/desativar");

        console.log("  POST   /acoes");
        console.log("  GET    /acoes");


    });

}).catch(err => console.error("Erro ao conectar:", err));
