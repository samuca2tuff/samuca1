const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


// ==============================
// CRIAR TABELA
// ==============================

async function criarTabela() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id BIGSERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL,
                email TEXT,
                data TEXT NOT NULL,
                horario TEXT NOT NULL,
                servico TEXT NOT NULL,
                tipo TEXT NOT NULL,
                observacoes TEXT,
                status TEXT DEFAULT 'Pendente',
                enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Banco conectado.");

    } catch (error) {

        console.error("❌ Erro no banco:", error);

    }

}

criarTabela();


// ==============================
// RECEBER AGENDAMENTO
// ==============================

app.post("/api/submit", async (req, res) => {

    try {

        const {
            nome,
            telefone,
            email,
            data,
            horario,
            servico,
            tipo,
            observacoes
        } = req.body;

        if (
            !nome ||
            !telefone ||
            !data ||
            !horario ||
            !servico ||
            !tipo
        ) {

            return res.status(400).json({
                success: false,
                message: "Preencha os campos obrigatórios."
            });

        }

        const result = await pool.query(
            `
            INSERT INTO appointments
            (
                nome,
                telefone,
                email,
                data,
                horario,
                servico,
                tipo,
                observacoes
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                nome,
                telefone,
                email || "",
                data,
                horario,
                servico,
                tipo,
                observacoes || ""
            ]
        );

        console.log("✅ Agendamento salvo:", nome);

        res.json({
            success: true,
            appointment: result.rows[0]
        });

    } catch (error) {

        console.error("❌ ERRO AO SALVAR:", error);

        res.status(500).json({
            success: false,
            message: "Erro ao salvar agendamento."
        });

    }

});


// ==============================
// PEGAR AGENDAMENTOS
// ==============================

app.get("/api/submissions", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                nome,
                telefone,
                email,
                data,
                horario,
                servico,
                tipo,
                observacoes,
                status,
                enviado_em AS "enviadoEm"
            FROM appointments
            ORDER BY id DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error("❌ ERRO AO BUSCAR:", error);

        res.status(500).json({
            success: false,
            message: "Erro ao buscar agendamentos."
        });

    }

});


// ==============================
// MUDAR STATUS
// ==============================

app.post("/api/status", async (req, res) => {

    try {

        const { id, status } = req.body;

        const permitidos = [
            "Pendente",
            "Confirmado",
            "Cancelado"
        ];

        if (!permitidos.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Status inválido."
            });

        }

        await pool.query(
            `
            UPDATE appointments
            SET status = $1
            WHERE id = $2
            `,
            [status, id]
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.error("❌ ERRO STATUS:", error);

        res.status(500).json({
            success: false
        });

    }

});


// ==============================
// APAGAR AGENDAMENTO
// ==============================

app.post("/api/delete", async (req, res) => {

    try {

        const { id } = req.body;

        if (!id) {

            return res.status(400).json({
                success: false,
                message: "ID não informado."
            });

        }

        const result = await pool.query(
            `
            DELETE FROM appointments
            WHERE id = $1
            `,
            [id]
        );

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Agendamento não encontrado."
            });

        }

        console.log("🗑️ Agendamento apagado:", id);

        res.json({
            success: true
        });

    } catch (error) {

        console.error("❌ ERRO AO APAGAR:", error);

        res.status(500).json({
            success: false,
            message: "Erro ao apagar agendamento."
        });

    }

});


// ==============================
// SERVIDOR
// ==============================

app.listen(PORT, () => {

    console.log(
        `🚀 SAMUCA rodando na porta ${PORT}`
    );

});
