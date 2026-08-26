const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// BANCO
// =====================================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// =====================================================
// LOGIN
// =====================================================

const ADMIN_USER = process.env.ADMIN_USER || "samuca";
const ADMIN_PASSWORD =
    process.env.ADMIN_PASSWORD || "troque_esta_senha";

const sessoes = new Map();

function criarSessao() {
    const token = crypto.randomBytes(32).toString("hex");

    sessoes.set(token, {
        criadoEm: Date.now()
    });

    return token;
}

function pegarCookie(req, nome) {
    const cookies = req.headers.cookie || "";

    for (const parte of cookies.split(";")) {
        const [chave, ...valor] = parte.trim().split("=");

        if (chave === nome) {
            return decodeURIComponent(valor.join("="));
        }
    }

    return null;
}

function estaLogado(req) {
    const token = pegarCookie(req, "samuca_session");

    return token ? sessoes.has(token) : false;
}

function exigirLogin(req, res, next) {
    if (!estaLogado(req)) {
        return res.status(401).json({
            success: false,
            message: "Não autorizado."
        });
    }

    next();
}

// =====================================================
// PREÇOS
// =====================================================

const PRECOS = {
    "Corte masculino": 25,
    "Corte + barba": 35,
    "Barba": 15,
    "Corte infantil": 20
};

// =====================================================
// HORÁRIOS
// =====================================================

const HORARIOS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30"
];

const STATUS_VALIDOS = [
    "Pendente",
    "Confirmado",
    "Em andamento",
    "Cancelado",
    "Finalizado"
];

// =====================================================
// PREPARAR BANCO
// =====================================================

async function prepararBanco() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id BIGSERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL,
                email TEXT DEFAULT '',
                data TEXT NOT NULL,
                horario TEXT NOT NULL,
                servico TEXT NOT NULL,
                tipo TEXT NOT NULL,
                observacoes TEXT DEFAULT '',
                status TEXT DEFAULT 'Pendente',
                pago BOOLEAN DEFAULT FALSE,
                preco NUMERIC(10,2) DEFAULT 0,
                enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS email TEXT DEFAULT ''
        `);

        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS observacoes TEXT DEFAULT ''
        `);

        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pendente'
        `);

        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT FALSE
        `);

        await pool.query(`
            ALTER TABLE appointments
            ADD COLUMN IF NOT EXISTS preco NUMERIC(10,2) DEFAULT 0
        `);

        await pool.query(`
            DROP INDEX IF EXISTS appointments_data_horario_unique
        `);

        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS appointments_data_horario_unique
            ON appointments (data, horario)
            WHERE status NOT IN ('Finalizado', 'Cancelado')
        `);

        console.log("✅ BANCO PRONTO");

    } catch (error) {
        console.error("❌ ERRO NO BANCO:", error);
    }
}

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({
            success: false,
            message: "Preencha usuário e senha."
        });
    }

    if (
        usuario !== ADMIN_USER ||
        senha !== ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Usuário ou senha incorretos."
        });
    }

    const token = criarSessao();

    res.setHeader(
        "Set-Cookie",
        `samuca_session=${token}; HttpOnly; Path=/; SameSite=Lax`
    );

    console.log("🔐 LOGIN:", usuario);

    res.json({
        success: true
    });
});

// =====================================================
// AUTH
// =====================================================

app.get("/api/auth", (req, res) => {
    if (!estaLogado(req)) {
        return res.status(401).json({
            success: false
        });
    }

    res.json({
        success: true
    });
});

// =====================================================
// LOGOUT
// =====================================================

app.post("/api/logout", (req, res) => {
    const token = pegarCookie(
        req,
        "samuca_session"
    );

    if (token) {
        sessoes.delete(token);
    }

    res.setHeader(
        "Set-Cookie",
        "samuca_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );

    res.json({
        success: true
    });
});

// =====================================================
// DASHBOARD
// =====================================================

app.get("/dashboard.html", (req, res) => {
    if (!estaLogado(req)) {
        return res.redirect("/login.html");
    }

    res.sendFile(
        __dirname + "/dashboard.html"
    );
});

// =====================================================
// ARQUIVOS
// =====================================================

app.use(
    express.static(__dirname, {
        etag: false,
        maxAge: 0
    })
);

// =====================================================
// HORÁRIOS
// =====================================================

app.get("/api/horarios", async (req, res) => {
    try {
        const data = req.query.data;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "Data não informada."
            });
        }

        const resultado = await pool.query(`
            SELECT horario
            FROM appointments
            WHERE data = $1
            AND status NOT IN ('Finalizado', 'Cancelado')
            ORDER BY horario
        `, [data]);

        res.set("Cache-Control", "no-store");

        res.json({
            success: true,
            ocupados: resultado.rows.map(
                x => x.horario
            )
        });

    } catch (error) {
        console.error(
            "❌ ERRO HORÁRIOS:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Erro ao verificar horários."
        });
    }
});

// =====================================================
// CRIAR AGENDAMENTO
// =====================================================

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

        console.log(
            "📥 NOVO FORMULÁRIO RECEBIDO:",
            req.body
        );

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
                message:
                    "Preencha todos os campos obrigatórios."
            });
        }

        if (!PRECOS.hasOwnProperty(servico)) {
            return res.status(400).json({
                success: false,
                message: "Serviço inválido."
            });
        }

        if (!HORARIOS.includes(horario)) {
            return res.status(400).json({
                success: false,
                message: "Horário inválido."
            });
        }

        const preco = PRECOS[servico];

        const existente = await pool.query(`
            SELECT id
            FROM appointments
            WHERE data = $1
            AND horario = $2
            AND status NOT IN ('Finalizado', 'Cancelado')
            LIMIT 1
        `, [
            data,
            horario
        ]);

        if (existente.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Esse horário já está ocupado."
            });
        }

        const resultado = await pool.query(`
            INSERT INTO appointments (
                nome,
                telefone,
                email,
                data,
                horario,
                servico,
                tipo,
                observacoes,
                status,
                pago,
                preco
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                'Pendente',
                FALSE,
                $9
            )
            RETURNING *
        `, [
            nome,
            telefone,
            email || "",
            data,
            horario,
            servico,
            tipo,
            observacoes || "",
            preco
        ]);

        console.log(
            "✅ AGENDAMENTO SALVO NO BANCO:",
            resultado.rows[0]
        );

        res.json({
            success: true,
            preco: preco,
            appointment: resultado.rows[0]
        });

    } catch (error) {

        console.error(
            "❌ ERRO AO SALVAR AGENDAMENTO:",
            error
        );

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message:
                    "Esse horário acabou de ser ocupado."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Erro ao salvar agendamento."
        });
    }
});

// =====================================================
// BUSCAR AGENDAMENTOS
// =====================================================

app.get(
    "/api/submissions",
    exigirLogin,
    async (req, res) => {

        try {

            const resultado = await pool.query(`
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
                    pago,
                    preco,
                    enviado_em AS "enviadoEm"
                FROM appointments
                ORDER BY id DESC
            `);

            console.log(
                "📋 DASHBOARD BUSCOU:",
                resultado.rows.length,
                "AGENDAMENTOS"
            );

            res.set({
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            });

            res.json(
                resultado.rows
            );

        } catch (error) {

            console.error(
                "❌ ERRO AO BUSCAR AGENDAMENTOS:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Erro ao buscar agendamentos."
            });
        }
    }
);

// =====================================================
// STATUS
// =====================================================

app.post(
    "/api/status",
    exigirLogin,
    async (req, res) => {

        try {

            const {
                id,
                status
            } = req.body;

            if (
                !id ||
                !STATUS_VALIDOS.includes(status)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Status inválido."
                });
            }

            await pool.query(`
                UPDATE appointments
                SET status = $1
                WHERE id = $2
            `, [
                status,
                id
            ]);

            console.log(
                `🔄 STATUS ${id}: ${status}`
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "❌ ERRO STATUS:",
                error
            );

            res.status(500).json({
                success: false
            });
        }
    }
);

// =====================================================
// PAGAMENTO
// =====================================================

app.post(
    "/api/payment",
    exigirLogin,
    async (req, res) => {

        try {

            const {
                id,
                pago
            } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false
                });
            }

            await pool.query(`
                UPDATE appointments
                SET pago = $1
                WHERE id = $2
            `, [
                Boolean(pago),
                id
            ]);

            console.log(
                `💰 PAGAMENTO ${id}:`,
                pago
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "❌ ERRO PAGAMENTO:",
                error
            );

            res.status(500).json({
                success: false
            });
        }
    }
);

// =====================================================
// APAGAR
// =====================================================

app.post(
    "/api/delete",
    exigirLogin,
    async (req, res) => {

        try {

            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID não informado."
                });
            }

            const resultado = await pool.query(`
                DELETE FROM appointments
                WHERE id = $1
            `, [id]);

            if (resultado.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Agendamento não encontrado."
                });
            }

            console.log(
                "🗑️ APAGADO:",
                id
            );

            res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "❌ ERRO AO APAGAR:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Erro ao apagar."
            });
        }
    }
);

// =====================================================
// HEALTH
// =====================================================

app.get("/api/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({
            success: true,
            server: "SAMUCA",
            database: "connected",
            status: "online"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            server: "SAMUCA",
            database: "error",
            status: "online"
        });
    }
});

// =====================================================
// INICIAR
// =====================================================

async function iniciar() {

    await prepararBanco();

    app.listen(
        PORT,
        () => {
            console.log(
                `🚀 SAMUCA ONLINE - PORTA ${PORT}`
            );
        }
    );
}

iniciar();
