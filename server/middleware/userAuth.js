const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Token de autenticação não fornecido",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autenticação do usuário:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

module.exports = userAuth;
