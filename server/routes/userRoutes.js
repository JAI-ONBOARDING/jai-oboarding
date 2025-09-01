const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");

// ROTAS PÚBLICAS (sem autenticação)
router.post("/register", userController.register); // Registrar usuário
router.post("/login", userController.login); // Login do usuário

// ROTAS PROTEGIDAS (só usuários logados)
router.get("/profile", userAuth, userController.getProfile); // Obter perfil
router.get("/my-company", userAuth, userController.getMyCompany); // Obter empresa do usuário
router.get("/my-company/files", userAuth, userController.getMyCompanyFiles); // Obter arquivos da empresa

module.exports = router;
