<!DOCTYPE html>
<html lang="pt-BR">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>SAMUCA • Dashboard</title>

<style>

* {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    margin: 0;
    background: #070707;
    color: white;
}

header {
    min-height: 75px;
    background: #111;
    border-bottom: 1px solid #292929;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 35px;
    gap: 15px;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 3px;
}

.logo span {
    color: #348cff;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.online {
    color: #39ff88;
    font-size: 13px;
}

.logout {
    padding: 9px 16px;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    background: #191919;
    color: #ff6b6b;
    font-weight: bold;
    cursor: pointer;
}

.logout:hover {
    background: #3a1616;
    border-color: #ff6b6b;
}

.container {
    padding: 35px;
    max-width: 1500px;
    margin: auto;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
}

.title h1 {
    margin: 0;
}

.refresh {
    padding: 12px 20px;
    border: 0;
    border-radius: 8px;
    background: #287cff;
    color: white;
    cursor: pointer;
    font-weight: bold;
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.stat {
    background: #111;
    border: 1px solid #292929;
    border-radius: 12px;
    padding: 20px;
}

.stat p {
    color: #777;
    margin: 0;
    font-size: 12px;
}

.stat h2 {
    margin: 10px 0 0;
    color: #348cff;
}

.report {
    margin-bottom: 30px;
}

.report h2 {
    font-size: 20px;
    margin-bottom: 15px;
}

.report-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
}

.report-card {
    background: #111;
    border: 1px solid #292929;
    border-radius: 12px;
    padding: 20px;
}

.report-card p {
    color: #777;
    margin: 0;
    font-size: 12px;
}

.report-card h2 {
    color: #39ff88;
    margin: 10px 0 0;
}

.filters {
    display: grid;
    grid-template-columns: 1fr 220px auto;
    gap: 12px;
    margin-bottom: 25px;
}

.filters input {
    width: 100%;
    padding: 13px 15px;
    border-radius: 8px;
    border: 1px solid #292929;
    background: #111;
    color: white;
    outline: none;
}

.filters input:focus {
    border-color: #348cff;
}

.filters input[type="date"] {
    color-scheme: dark;
}

.clear-filter {
    padding: 12px 18px;
    border: 1px solid #292929;
    border-radius: 8px;
    background: #191919;
    color: white;
    cursor: pointer;
}

.tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-bottom: 25px;
    padding-bottom: 5px;
}

.tab {
    white-space: nowrap;
    padding: 11px 18px;
    background: #111;
    border: 1px solid #292929;
    border-radius: 8px;
    color: #aaa;
    cursor: pointer;
    font-weight: bold;
}

.tab:hover {
    color: white;
}

.tab.active {
    background: #287cff;
    border-color: #287cff;
    color: white;
}

#appointments {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.appointment {
    background: #111;
    border: 1px solid #292929;
    border-radius: 15px;
    padding: 22px;
    transition: transform .15s, border .15s;
}

.appointment:hover {
    transform: translateY(-2px);
    border-color: #3a3a3a;
}

.appointment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.appointment-header h2 {
    margin: 0;
    font-size: 20px;
}

.status {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    white-space: nowrap;
}

.status-pendente {
    background: #332b00;
    color: #ffd83d;
}

.status-confirmado {
    background: #073d25;
    color: #39ff88;
}

.status-andamento {
    background: #30204a;
    color: #bd8cff;
}

.status-cancelado {
    background: #451818;
    color: #ff6b6b;
}

.status-finalizado {
    background: #172d45;
    color: #6fb4ff;
}

.info {
    margin: 10px 0;
    color: #aaa;
    line-height: 1.4;
}

.info strong {
    color: white;
}

.price {
    margin-top: 18px;
    padding: 15px;
    background: #090909;
    border: 1px solid #292929;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price span:last-child {
    color: #39ff88;
    font-size: 20px;
    font-weight: bold;
}

.paid {
    color: #39ff88;
    font-weight: bold;
}

.unpaid {
    color: #ffd83d;
    font-weight: bold;
}

.actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 20px;
}

.actions button {
    padding: 11px;
    border: 0;
    border-radius: 7px;
    cursor: pointer;
    color: white;
    font-weight: bold;
}

.confirm {
    background: #168b4d;
}

.pending {
    background: #806d00;
}

.progress {
    background: #6542a3;
}

.cancel {
    background: #8b2424;
}

.payment {
    background: #176b52;
}

.finish {
    background: #287cff;
}

.delete {
    background: #4a2020;
}

.actions button:hover {
    opacity: .85;
}

.empty {
    grid-column: 1 / -1;
    color: #666;
    text-align: center;
    padding: 70px 20px;
    background: #111;
    border: 1px solid #292929;
    border-radius: 15px;
}

.history-info {
    margin-bottom: 20px;
    padding: 15px 18px;
    background: #0d2419;
    border: 1px solid #164d31;
    border-radius: 10px;
    color: #39ff88;
}

@media(max-width: 700px) {

    header {
        padding: 15px 18px;
    }

    .logo {
        font-size: 16px;
    }

    .online {
        display: none;
    }

    .container {
        padding: 20px 15px;
    }

    .title {
        align-items: flex-start;
        flex-direction: column;
    }

    .title h1 {
        font-size: 24px;
    }

    .refresh {
        width: 100%;
    }

    .filters {
        grid-template-columns: 1fr;
    }

    #appointments {
        grid-template-columns: 1fr;
    }

    .actions {
        grid-template-columns: 1fr;
    }

}

</style>

</head>

<body>

<header>

    <div class="logo">
        SAM<span>UCA</span> BARBERSHOP
    </div>

    <div class="header-right">

        <div class="online">
            ● ONLINE
        </div>

        <button class="logout" onclick="sair()">
            🚪 Sair
        </button>

    </div>

</header>

<div class="container">

    <div class="title">

        <h1>
            Agendamentos
        </h1>

        <button class="refresh" onclick="carregar()">
            ↻ Atualizar
        </button>

    </div>

    <div class="stats">

        <div class="stat">
            <p>TOTAL</p>
            <h2 id="total">0</h2>
        </div>

        <div class="stat">
            <p>PENDENTES</p>
            <h2 id="pendentes">0</h2>
        </div>

        <div class="stat">
            <p>CONFIRMADOS</p>
            <h2 id="confirmados">0</h2>
        </div>

        <div class="stat">
            <p>EM ANDAMENTO</p>
            <h2 id="andamento">0</h2>
        </div>

        <div class="stat">
            <p>PAGOS</p>
            <h2 id="pagos">0</h2>
        </div>

        <div class="stat">
            <p>FINALIZADOS</p>
            <h2 id="finalizados">0</h2>
        </div>

        <div class="stat">
            <p>TOTAL RECEBIDO</p>
            <h2 id="recebido">$0.00</h2>
        </div>

    </div>

    <div class="report">

        <h2>
            📊 Relatório de ganhos
        </h2>

        <div class="report-grid">

            <div class="report-card">
                <p>HOJE</p>
                <h2 id="ganhoHoje">$0.00</h2>
            </div>

            <div class="report-card">
                <p>ESTA SEMANA</p>
                <h2 id="ganhoSemana">$0.00</h2>
            </div>

            <div class="report-card">
                <p>ESTE MÊS</p>
                <h2 id="ganhoMes">$0.00</h2>
            </div>

        </div>

    </div>

    <div class="filters">

        <input
            type="text"
            id="busca"
            placeholder="🔎 Buscar por nome ou telefone..."
            oninput="renderizar()"
        >

        <input
            type="date"
            id="filtroData"
            onchange="renderizar()"
        >

        <button class="clear-filter" onclick="limparFiltros()">
            Limpar filtros
        </button>

    </div>

    <div class="tabs">

        <button class="tab active" onclick="mudarAba('todos', this)">
            📋 Todos
        </button>

        <button class="tab" onclick="mudarAba('Pendente', this)">
            ⏳ Pendentes
        </button>

        <button class="tab" onclick="mudarAba('Confirmado', this)">
            ✅ Confirmados
        </button>

        <button class="tab" onclick="mudarAba('Em andamento', this)">
            💈 Em andamento
        </button>

        <button class="tab" onclick="mudarAba('pago', this)">
            💰 Pagos
        </button>

        <button class="tab" onclick="mudarAba('historico', this)">
            📚 Histórico pago
        </button>

        <button class="tab" onclick="mudarAba('Finalizado', this)">
            ✂️ Finalizados
        </button>

        <button class="tab" onclick="mudarAba('Cancelado', this)">
            ❌ Cancelados
        </button>

    </div>

    <div id="appointments"></div>

</div>

<script>

let dados = [];

let filtroAtual = "todos";


function obterHoje() {

    const hoje = new Date();

    return hoje.getFullYear() + "-" +
        String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoje.getDate()).padStart(2, "0");

}


/* =====================================================
   CONFIGURAR DATA
   ===================================================== */

function configurarData() {

    const campo =
        document.getElementById("filtroData");

    const hoje =
        obterHoje();

    campo.min = hoje;

    /*
       IMPORTANTE:
       NÃO colocamos a data de hoje automaticamente.
       Assim a aba TODOS mostra todos os agendamentos.
    */

}


/* =====================================================
   LOGIN
   ===================================================== */

async function verificarLogin() {

    try {

        const response =
            await fetch("/api/auth");

        if (!response.ok) {

            window.location.href =
                "/login.html";

            return false;

        }

        return true;

    }

    catch {

        window.location.href =
            "/login.html";

        return false;

    }

}


/* =====================================================
   CARREGAR
   ===================================================== */

async function carregar() {

    try {

        configurarData();

        const response =
            await fetch("/api/submissions");

        if (response.status === 401) {

            window.location.href =
                "/login.html";

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Erro no servidor"
            );

        }

        dados =
            await response.json();

        console.log(
            "📋 AGENDAMENTOS RECEBIDOS:",
            dados
        );

        atualizarEstatisticas();

        atualizarRelatorio();

        renderizar();

    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "appointments"
        ).innerHTML = `

            <div class="empty">

                ❌ Servidor offline.

                <br><br>

                Verifique sua conexão.

            </div>

        `;

    }

}


/* =====================================================
   ESTATÍSTICAS
   ===================================================== */

function atualizarEstatisticas() {

    document.getElementById("total").textContent =
        dados.length;

    document.getElementById("pendentes").textContent =
        dados.filter(
            x => x.status === "Pendente"
        ).length;

    document.getElementById("confirmados").textContent =
        dados.filter(
            x => x.status === "Confirmado"
        ).length;

    document.getElementById("andamento").textContent =
        dados.filter(
            x => x.status === "Em andamento"
        ).length;

    document.getElementById("pagos").textContent =
        dados.filter(
            x => x.pago === true
        ).length;

    document.getElementById("finalizados").textContent =
        dados.filter(
            x => x.status === "Finalizado"
        ).length;

    const totalRecebido =
        dados
            .filter(
                x => x.pago === true
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.preco || 0),
                0
            );

    document.getElementById("recebido").textContent =
        formatarPreco(totalRecebido);

}


/* =====================================================
   RELATÓRIO
   ===================================================== */

function atualizarRelatorio() {

    const hoje =
        new Date();

    const hojeTexto =
        formatarDataISO(hoje);

    const inicioSemana =
        new Date(hoje);

    const diaSemana =
        hoje.getDay();

    const diferenca =
        diaSemana === 0
            ? 6
            : diaSemana - 1;

    inicioSemana.setDate(
        hoje.getDate() - diferenca
    );

    inicioSemana.setHours(
        0,
        0,
        0,
        0
    );

    const inicioMes =
        new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            1
        );

    let ganhoHoje = 0;

    let ganhoSemana = 0;

    let ganhoMes = 0;

    dados.forEach(item => {

        if (!item.pago) {
            return;
        }

        const valor =
            Number(item.preco || 0);

        const dataItem =
            criarDataLocal(item.data);

        if (
            item.data === hojeTexto
        ) {

            ganhoHoje += valor;

        }

        if (
            dataItem >= inicioSemana
        ) {

            ganhoSemana += valor;

        }

        if (
            dataItem >= inicioMes
        ) {

            ganhoMes += valor;

        }

    });

    document.getElementById(
        "ganhoHoje"
    ).textContent =
        formatarPreco(ganhoHoje);

    document.getElementById(
        "ganhoSemana"
    ).textContent =
        formatarPreco(ganhoSemana);

    document.getElementById(
        "ganhoMes"
    ).textContent =
        formatarPreco(ganhoMes);

}


/* =====================================================
   ABAS
   ===================================================== */

function mudarAba(
    filtro,
    botao
) {

    filtroAtual =
        filtro;

    document
        .querySelectorAll(".tab")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    botao.classList.add(
        "active"
    );

    renderizar();

}


/* =====================================================
   LIMPAR FILTROS
   ===================================================== */

function limparFiltros() {

    document.getElementById(
        "busca"
    ).value = "";

    /*
       Agora limpa a data também.
       Não força mais a data de hoje.
    */

    document.getElementById(
        "filtroData"
    ).value = "";

    renderizar();

}


/* =====================================================
   RENDERIZAR
   ===================================================== */

function renderizar() {

    const container =
        document.getElementById(
            "appointments"
        );

    const busca =
        document
            .getElementById("busca")
            .value
            .trim()
            .toLowerCase();

    const dataFiltro =
        document.getElementById(
            "filtroData"
        ).value;

    let lista =
        dados.slice();


    /* =================================================
       FILTRO DAS ABAS
       ================================================= */

    if (
        filtroAtual !== "todos"
    ) {

        if (
            filtroAtual === "pago"
        ) {

            lista =
                lista.filter(
                    item =>
                        item.pago === true
                );

        }

        else if (
            filtroAtual === "historico"
        ) {

            lista =
                lista.filter(
                    item =>
                        item.pago === true
                );

        }

        else {

            lista =
                lista.filter(
                    item =>
                        item.status ===
                        filtroAtual
                );

        }

    }


    /* =================================================
       BUSCA
       ================================================= */

    if (busca) {

        lista =
            lista.filter(
                item => {

                    const nome =
                        normalizar(
                            item.nome
                        );

                    const telefone =
                        normalizar(
                            item.telefone
                        );

                    const email =
                        normalizar(
                            item.email
                        );

                    const servico =
                        normalizar(
                            item.servico
                        );

                    const horario =
                        normalizar(
                            item.horario
                        );

                    return (

                        nome.includes(
                            busca
                        ) ||

                        telefone.includes(
                            busca
                        ) ||

                        email.includes(
                            busca
                        ) ||

                        servico.includes(
                            busca
                        ) ||

                        horario.includes(
                            busca
                        )

                    );

                }
            );

    }


    /* =================================================
       FILTRO DE DATA
       =================================================

       IMPORTANTE:

       Se estiver na aba TODOS e não houver
       uma data escolhida, mostra tudo.

       Se escolher uma data, filtra por ela.

       Histórico continua mostrando todos
       os pagos.
    */

    if (
        dataFiltro &&
        filtroAtual !== "historico"
    ) {

        lista =
            lista.filter(
                item =>
                    item.data ===
                    dataFiltro
            );

    }


    /* =================================================
       VAZIO
       ================================================= */

    if (
        lista.length === 0
    ) {

        let mensagem =
            "Nenhum agendamento encontrado.";

        if (
            filtroAtual === "historico"
        ) {

            mensagem =
                "📚 Nenhum corte pago no histórico.";

        }

        container.innerHTML = `

            <div class="empty">

                ${mensagem}

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /* =================================================
       AVISO HISTÓRICO
       ================================================= */

    if (
        filtroAtual === "historico"
    ) {

        const aviso =
            document.createElement(
                "div"
            );

        aviso.className =
            "history-info";

        aviso.style.gridColumn =
            "1 / -1";

        aviso.innerHTML = `

            💰 <strong>
                Histórico de cortes pagos
            </strong>

            <br>

            Aqui aparecem todos os cortes que já foram pagos.

        `;

        container.appendChild(
            aviso
        );

    }


    /* =================================================
       CARDS
       ================================================= */

    lista.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "appointment";

            const statusClass =
                getStatusClass(
                    item.status
                );

            const preco =
                Number(
                    item.preco || 0
                );

            const pagoTexto =
                item.pago
                    ? "✓ PAGO"
                    : "Não pago";

            const pagoClass =
                item.pago
                    ? "paid"
                    : "unpaid";


            card.innerHTML = `

                <div class="appointment-header">

                    <h2>
                        ${escapeHTML(
                            item.nome
                        )}
                    </h2>

                    <span
                        class="status ${statusClass}"
                    >
                        ${escapeHTML(
                            item.status
                        )}
                    </span>

                </div>


                <div class="info">

                    📞
                    <strong>
                        Telefone:
                    </strong>

                    ${escapeHTML(
                        item.telefone
                    )}

                </div>


                <div class="info">

                    📧
                    <strong>
                        E-mail:
                    </strong>

                    ${escapeHTML(
                        item.email ||
                        "Não informado"
                    )}

                </div>


                <div class="info">

                    📅
                    <strong>
                        Data:
                    </strong>

                    ${formatarData(
                        item.data
                    )}

                </div>


                <div class="info">

                    🕐
                    <strong>
                        Horário:
                    </strong>

                    ${escapeHTML(
                        item.horario
                    )}

                </div>


                <div class="info">

                    ✂️
                    <strong>
                        Serviço:
                    </strong>

                    ${escapeHTML(
                        item.servico
                    )}

                </div>


                <div class="info">

                    💈
                    <strong>
                        Corte:
                    </strong>

                    ${escapeHTML(
                        item.tipo
                    )}

                </div>


                <div class="info">

                    📝
                    <strong>
                        Observações:
                    </strong>

                    ${escapeHTML(
                        item.observacoes ||
                        "Nenhuma"
                    )}

                </div>


                <div class="price">

                    <span>
                        💵 Valor
                    </span>

                    <span>
                        ${formatarPreco(
                            preco
                        )}
                    </span>

                </div>


                <div class="info">

                    💰
                    <strong>
                        Pagamento:
                    </strong>

                    <span
                        class="${pagoClass}"
                    >
                        ${pagoTexto}
                    </span>

                </div>


                <div class="actions">

                    ${
                        item.status !==
                        "Confirmado" &&
                        item.status !==
                        "Em andamento" &&
                        item.status !==
                        "Finalizado"

                        ?

                        `
                        <button
                            class="confirm"
                            onclick="mudarStatus(
                                ${item.id},
                                'Confirmado'
                            )"
                        >
                            ✓ Confirmar
                        </button>
                        `

                        :

                        ""
                    }


                    ${
                        item.status ===
                        "Confirmado"

                        ?

                        `
                        <button
                            class="progress"
                            onclick="mudarStatus(
                                ${item.id},
                                'Em andamento'
                            )"
                        >
                            💈 Iniciar Corte
                        </button>
                        `

                        :

                        ""
                    }


                    ${
                        item.status !==
                        "Pendente" &&
                        item.status !==
                        "Finalizado" &&
                        item.status !==
                        "Cancelado"

                        ?

                        `
                        <button
                            class="pending"
                            onclick="mudarStatus(
                                ${item.id},
                                'Pendente'
                            )"
                        >
                            ⏳ Pendente
                        </button>
                        `

                        :

                        ""
                    }


                    ${
                        item.status !==
                        "Cancelado" &&
                        item.status !==
                        "Finalizado"

                        ?

                        `
                        <button
                            class="cancel"
                            onclick="mudarStatus(
                                ${item.id},
                                'Cancelado'
                            )"
                        >
                            ❌ Cancelar
                        </button>
                        `

                        :

                        ""
                    }


                    ${
                        !item.pago

                        ?

                        `
                        <button
                            class="payment"
                            onclick="mudarPagamento(
                                ${item.id},
                                true
                            )"
                        >
                            💰 Marcar Pago
                        </button>
                        `

                        :

                        `
                        <button
                            class="pending"
                            onclick="mudarPagamento(
                                ${item.id},
                                false
                            )"
                        >
                            ↩️ Desmarcar Pago
                        </button>
                        `
                    }


                    ${
                        item.status !==
                        "Finalizado" &&
                        item.status !==
                        "Cancelado"

                        ?

                        `
                        <button
                            class="finish"
                            onclick="finalizar(
                                ${item.id}
                            )"
                        >
                            ✂️ Finalizar Corte
                        </button>
                        `

                        :

                        ""
                    }


                    <button
                        class="delete"
                        onclick="apagar(
                            ${item.id}
                        )"
                    >
                        🗑️ Apagar
                    </button>

                </div>

            `;

            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   NORMALIZAR
   ===================================================== */

function normalizar(valor) {

    return String(
        valor || ""
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


/* =====================================================
   STATUS
   ===================================================== */

async function mudarStatus(
    id,
    status
) {

    if (
        status === "Cancelado"
    ) {

        const confirmar =
            confirm(
                "Tem certeza que deseja cancelar este agendamento?"
            );

        if (!confirmar) {
            return;
        }

    }


    try {

        const response =
            await fetch(
                "/api/status",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id,
                            status
                        })

                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "/login.html";

            return;

        }


        const resultado =
            await response.json();


        if (
            !resultado.success
        ) {

            alert(
                resultado.message ||
                "Erro ao atualizar."
            );

            return;

        }


        await carregar();

    }

    catch(error) {

        console.error(error);

        alert(
            "Erro de conexão."
        );

    }

}


/* =====================================================
   FINALIZAR
   ===================================================== */

async function finalizar(id) {

    const confirmar =
        confirm(
            "Finalizar este corte?\n\n" +
            "O horário será liberado para outro cliente."
        );

    if (!confirmar) {
        return;
    }

    await mudarStatus(
        id,
        "Finalizado"
    );

}


/* =====================================================
   PAGAMENTO
   ===================================================== */

async function mudarPagamento(
    id,
    pago
) {

    try {

        const response =
            await fetch(
                "/api/payment",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id,
                            pago
                        })

                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "/login.html";

            return;

        }


        const resultado =
            await response.json();


        if (
            !resultado.success
        ) {

            alert(
                resultado.message ||
                "Erro ao atualizar pagamento."
            );

            return;

        }


        await carregar();


        if (
            pago === true
        ) {

            const botoes =
                document.querySelectorAll(
                    ".tab"
                );

            const botaoHistorico =
                botoes[5];

            filtroAtual =
                "historico";


            document
                .querySelectorAll(".tab")
                .forEach(
                    tab =>
                        tab.classList.remove(
                            "active"
                        )
                );


            if (
                botaoHistorico
            ) {

                botaoHistorico.classList.add(
                    "active"
                );

            }


            renderizar();

        }

    }

    catch(error) {

        console.error(error);

        alert(
            "Erro de conexão."
        );

    }

}


/* =====================================================
   APAGAR
   ===================================================== */

async function apagar(id) {

    const confirmar =
        confirm(
            "⚠️ APAGAR AGENDAMENTO?\n\n" +
            "Essa ação não pode ser desfeita."
        );

    if (!confirmar) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/delete",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id
                        })

                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "/login.html";

            return;

        }


        const resultado =
            await response.json();


        if (
            !resultado.success
        ) {

            alert(
                resultado.message ||
                "Erro ao apagar."
            );

            return;

        }


        await carregar();

    }

    catch(error) {

        console.error(error);

        alert(
            "Erro de conexão."
        );

    }

}


/* =====================================================
   SAIR
   ===================================================== */

async function sair() {

    const confirmar =
        confirm(
            "Deseja realmente sair do dashboard?"
        );

    if (!confirmar) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/logout",
                {
                    method: "POST"
                }
            );


        const resultado =
            await response.json();


        if (
            resultado.success
        ) {

            window.location.href =
                "/login.html";

        }

        else {

            alert(
                "Não foi possível sair."
            );

        }

    }

    catch(error) {

        console.error(error);

        alert(
            "Erro de conexão."
        );

    }

}


/* =====================================================
   CLASSE STATUS
   ===================================================== */

function getStatusClass(
    status
) {

    if (
        status === "Pendente"
    )
        return "status-pendente";

    if (
        status === "Confirmado"
    )
        return "status-confirmado";

    if (
        status === "Em andamento"
    )
        return "status-andamento";

    if (
        status === "Cancelado"
    )
        return "status-cancelado";

    if (
        status === "Finalizado"
    )
        return "status-finalizado";

    return "";

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}


/* =====================================================
   PREÇO
   ===================================================== */

function formatarPreco(
    valor
) {

    return "$" +
        Number(
            valor || 0
        ).toFixed(2);

}


/* =====================================================
   DATA LOCAL
   ===================================================== */

function criarDataLocal(
    data
) {

    if (!data) {

        return new Date(
            "invalid"
        );

    }


    const partes =
        data.split("-");


    return new Date(

        Number(
            partes[0]
        ),

        Number(
            partes[1]
        ) - 1,

        Number(
            partes[2]
        )

    );

}


/* =====================================================
   DATA ISO
   ===================================================== */

function formatarDataISO(
    data
) {

    const ano =
        data.getFullYear();

    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        ano +
        "-" +
        mes +
        "-" +
        dia
    );

}


/* =====================================================
   FORMATAR DATA
   ===================================================== */

function formatarData(
    data
) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* =====================================================
   INICIAR
   ===================================================== */

(async function iniciar() {

    configurarData();

    const logado =
        await verificarLogin();


    if (logado) {

        await carregar();

        setInterval(
            carregar,
            5000
        );

    }

})();

</script>

</body>
</html>
