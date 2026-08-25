const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});

const upload = multer({ storage });

let submissions = [];

app.post("/api/submit", upload.single("foto"), (req, res) => {

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

    const agendamento = {
        id: Date.now(),
        nome,
        telefone,
        email,
        data,
        horario,
        servico,
        tipo,
        observacoes,
        foto: req.file
            ? "/uploads/" + req.file.filename
            : null,
        status: "Pendente",
        enviadoEm: new Date().toLocaleString("pt-BR")
    };

    submissions.push(agendamento);

    res.json({
        success: true
    });
});

app.get("/api/submissions", (req, res) => {
    res.json(submissions);
});

app.post("/api/status", (req, res) => {

    const { id, status } = req.body;

    const agendamento =
        submissions.find(item => item.id == id);

    if (!agendamento) {
        return res.status(404).json({
            success: false
        });
    }

    agendamento.status = status;

    res.json({
        success: true
    });
});

app.listen(PORT, () => {
    console.log(`SAMUCA rodando em http://localhost:${PORT}`);
});