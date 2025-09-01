const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Rota setup - Criar primeiro admin (pública, só funciona uma vez)
router.post("/setup", authController.setup);

// Rota login - Fazer login (pública)
router.post("/login", authController.login);

// Rota para obter dados do admin logado (protegida)
router.get("/me", auth, authController.me);

// Rota logout - Limpar token (protegida, mas opcional)
router.post("/logout", auth, authController.logout);

module.exports = router;
