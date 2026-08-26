const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================================
// POSTGRESQL
// =====================================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});


// =====================================================
// EXPRESS
// =====================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static(__dirname));


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


// =====================================================
// STATUS
// =====================================================

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

        console.log("🔄 Preparando banco SAMUCA...");


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

                pago BOOLEAN DEFAULT FALSE,

                preco NUMERIC(10,2) DEFAULT 0,

                enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            )

        `);


        await pool.query(`

            ALTER TABLE appointments

            ADD COLUMN IF NOT EXISTS pago
            BOOLEAN DEFAULT FALSE

        `);


        await pool.query(`

            ALTER TABLE appointments

            ADD COLUMN IF NOT EXISTS preco
            NUMERIC(10,2) DEFAULT 0

        `);


        await pool.query(`

            ALTER TABLE appointments

            ADD COLUMN IF NOT EXISTS status
            TEXT DEFAULT 'Pendente'

        `);


        await pool.query(`

            ALTER TABLE appointments

            ADD COLUMN IF NOT EXISTS observacoes
            TEXT

        `);


        // ---------------------------------------------
        // Corrigir preços antigos que estejam zerados
        // ---------------------------------------------

        for (const [servico, preco] of Object.entries(PRECOS)) {

            await pool.query(

                `

                UPDATE appointments

                SET preco = $1

                WHERE servico = $2

                AND (preco IS NULL OR preco = 0)

                `,

                [preco, servico]

            );

        }


        // ---------------------------------------------
        // Índice que bloqueia horários ativos
        // ---------------------------------------------

        await pool.query(`

            DROP INDEX IF EXISTS
            appointments_data_horario_unique

        `);


        await pool.query(`

            CREATE UNIQUE INDEX IF NOT EXISTS
            appointments_data_horario_unique

            ON appointments (data, horario)

            WHERE status NOT IN
            ('Finalizado', 'Cancelado')

        `);


        console.log("✅ Banco SAMUCA preparado.");

    }

    catch (error) {

        console.error(
            "❌ Erro preparando banco:",
            error
        );

    }

}


prepararBanco();


// =====================================================
// HORÁRIOS OCUPADOS
// =====================================================

app.get(
    "/api/horarios",
    async (req, res) => {

        try {

            const data =
                req.query.data;


            if (!data) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Data não informada."

                });

            }


            const resultado =
                await pool.query(

                    `

                    SELECT horario

                    FROM appointments

                    WHERE data = $1

                    AND status NOT IN
                    ('Finalizado', 'Cancelado')

                    ORDER BY horario

                    `,

                    [data]

                );


            const ocupados =
                resultado.rows.map(
                    item => item.horario
                );


            res.json({

                success: true,

                ocupados

            });

        }

        catch (error) {

            console.error(
                "❌ Erro horários:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Erro ao verificar horários."

            });

        }

    }
);


// =====================================================
// CRIAR AGENDAMENTO
// =====================================================

app.post(
    "/api/submit",
    async (req, res) => {

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

            } = req.body || {};


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


            if (
                !Object.prototype.hasOwnProperty.call(
                    PRECOS,
                    servico
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Serviço inválido."

                });

            }


            if (
                !HORARIOS.includes(horario)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Horário inválido."

                });

            }


            const preco =
                PRECOS[servico];


            // -----------------------------------------
            // VERIFICAR HORÁRIO
            // -----------------------------------------

            const existente =
                await pool.query(

                    `

                    SELECT id

                    FROM appointments

                    WHERE data = $1

                    AND horario = $2

                    AND status NOT IN
                    ('Finalizado', 'Cancelado')

                    LIMIT 1

                    `,

                    [
                        data,
                        horario
                    ]

                );


            if (
                existente.rows.length > 0
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "❌ Esse horário já está ocupado."

                });

            }


            // -----------------------------------------
            // SALVAR
            // -----------------------------------------

            const resultado =
                await pool.query(

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

                        observacoes,

                        status,

                        pago,

                        preco

                    )

                    VALUES

                    (

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

                    `,

                    [

                        nome,

                        telefone,

                        email || "",

                        data,

                        horario,

                        servico,

                        tipo,

                        observacoes || "",

                        preco

                    ]

                );


            console.log(
                "✅ NOVO AGENDAMENTO:",
                nome,
                data,
                horario,
                `$${preco.toFixed(2)}`
            );


            res.json({

                success: true,

                preco,

                appointment:
                    resultado.rows[0]

            });

        }

        catch (error) {

            if (
                error.code === "23505"
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "❌ Esse horário acabou de ser ocupado."

                });

            }


            console.error(
                "❌ ERRO AO SALVAR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Erro ao salvar agendamento."

            });

        }

    }
);


// =====================================================
// LISTAR AGENDAMENTOS
// =====================================================

app.get(
    "/api/submissions",
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

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


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "❌ ERRO AO BUSCAR:",
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
// ALTERAR STATUS
// =====================================================

app.post(
    "/api/status",
    async (req, res) => {

        try {

            const {
                id,
                status
            } = req.body || {};


            if (
                !id ||
                !STATUS_VALIDOS.includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Status inválido."

                });

            }


            const resultado =
                await pool.query(

                    `

                    UPDATE appointments

                    SET status = $1

                    WHERE id = $2

                    RETURNING *

                    `,

                    [
                        status,
                        id
                    ]

                );


            if (
                resultado.rowCount === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Agendamento não encontrado."

                });

            }


            console.log(
                `🔄 Agendamento ${id}: ${status}`
            );


            res.json({

                success: true,

                appointment:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "❌ ERRO STATUS:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Erro ao alterar status."

            });

        }

    }
);


// =====================================================
// PAGAMENTO
// =====================================================

app.post(
    "/api/payment",
    async (req, res) => {

        try {

            const {
                id,
                pago
            } = req.body || {};


            if (!id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "ID não informado."

                });

            }


            const valorPago =
                pago === true;


            const resultado =
                await pool.query(

                    `

                    UPDATE appointments

                    SET pago = $1

                    WHERE id = $2

                    RETURNING *

                    `,

                    [
                        valorPago,
                        id
                    ]

                );


            if (
                resultado.rowCount === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Agendamento não encontrado."

                });

            }


            console.log(
                `💰 Pagamento ${id}:`,
                valorPago
            );


            res.json({

                success: true,

                appointment:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "❌ ERRO PAGAMENTO:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Erro ao atualizar pagamento."

            });

        }

    }
);


// =====================================================
// APAGAR AGENDAMENTO
// =====================================================

app.post(
    "/api/delete",
    async (req, res) => {

        try {

            const {
                id
            } = req.body || {};


            if (!id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "ID não informado."

                });

            }


            const resultado =
                await pool.query(

                    `

                    DELETE FROM appointments

                    WHERE id = $1

                    `,

                    [id]

                );


            if (
                resultado.rowCount === 0
            ) {

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

        }

        catch (error) {

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
// HEALTH CHECK
// =====================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            server: "SAMUCA",

            status: "online"

        });

    }
);


// =====================================================
// INICIAR
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            `🚀 SAMUCA ONLINE NA PORTA ${PORT}`
        );

    }
);
