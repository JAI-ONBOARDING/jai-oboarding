require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Configuração CORS para desenvolvimento local - permitir todas as origens
app.use(
  cors({
    origin: "*", // Permitir todas as origens para desenvolvimento
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "ngrok-skip-browser-warning",
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Para compatibilidade com alguns navegadores
  })
);

// Resposta automática para requisições OPTIONS (preflight)
app.options("*", cors());

// Middleware para parsing de JSON e dados de formulário
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware de logging para monitoramento de requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Definição das rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

// Endpoint de verificação de saúde da API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "JAI API funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint raiz para verificar se a API está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "JAI API - Servidor funcionando!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      companies: "/api/companies",
    },
  });
});

// Middleware global para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro global:", err.stack);
  res.status(500).json({
    error: "Algo deu errado!",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// Inicialização da conexão com MongoDB e servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Servidor conectado ao MongoDB com sucesso");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`URL: http://localhost:${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar MongoDB:", err.message);
    process.exit(1);
  });
