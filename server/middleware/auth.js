const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

const auth = async (req, res, next) => {
  try {
    // Pegar token do header Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error:
          "Token de acesso não fornecido. Use: Authorization: Bearer <token>",
      });
    }

    // Extrair token removendo "Bearer "
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar admin no banco para garantir que ainda existe e está ativo
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        error: "Admin não encontrado. Token inválido",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        error: "Admin desativado. Acesso negado",
      });
    }

    // Adicionar dados do admin na request para uso nos controllers
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expirado. Faça login novamente" });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = auth;
