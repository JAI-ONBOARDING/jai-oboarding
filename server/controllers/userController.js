const User = require("../models/UserModel");
const Company = require("../models/CompanyModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

// Geração de token JWT para autenticação
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Registro de novo usuário no sistema
exports.register = async (req, res) => {
  try {
    const { email, password, nome } = req.body;

    // Validação de campos obrigatórios
    if (!email || !password || !nome) {
      return res.status(400).json({
        error: "Email, senha e nome são obrigatórios",
      });
    }

    // Verificação de email duplicado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email já cadastrado",
      });
    }

    // Criação do novo usuário
    const user = new User({
      email,
      password,
      nome,
    });

    await user.save();

    // Geração do token de autenticação
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);

    // Tratamento de erro de duplicação
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email já cadastrado",
      });
    }

    // Tratamento de erro de conexão com MongoDB
    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoServerSelectionError"
    ) {
      console.error("Erro de conexão com MongoDB");
      return res.status(500).json({
        error: "Erro de conexão com o banco de dados",
        details: "Verifique se o MongoDB está rodando",
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

// Autenticação de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação de campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Busca do usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    // Verificação da senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    // Atualização do último login
    user.lastLogin = new Date();
    await user.save();

    // Geração do token de autenticação
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

// Obtenção do perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

// Obtenção dos dados da empresa do usuário
exports.getMyCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    if (!user.companyId) {
      return res.status(404).json({
        error: "Usuário não possui empresa cadastrada",
      });
    }

    const company = await Company.findById(user.companyId);
    if (!company) {
      // Se a empresa não existe mais, remover a referência inválida
      user.companyId = undefined;
      await user.save();

      return res.status(404).json({
        error:
          "Empresa não encontrada. A referência foi removida automaticamente.",
        suggestion: "Você pode criar uma nova empresa agora.",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Erro ao obter empresa:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};

// Obtenção dos arquivos da empresa do usuário
exports.getMyCompanyFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    if (!user.companyId) {
      return res.status(404).json({
        error: "Usuário não possui empresa cadastrada",
      });
    }

    // Verificar se a empresa ainda existe
    const company = await Company.findById(user.companyId);
    if (!company) {
      // Se a empresa não existe mais, remover a referência inválida
      user.companyId = undefined;
      await user.save();

      return res.status(404).json({
        error:
          "Empresa não encontrada. A referência foi removida automaticamente.",
        suggestion: "Você pode criar uma nova empresa agora.",
      });
    }

    // Configuração do GridFS para busca de arquivos
    const mongoose = require("mongoose");
    const { GridFSBucket } = require("mongodb");

    const conn = mongoose.connection;
    let gridFSBucket;

    if (conn.readyState === 1) {
      gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    } else {
      return res.status(500).json({
        error: "Conexão com banco não disponível",
      });
    }

    // Busca dos arquivos da empresa do usuário
    const files = await conn.db
      .collection("uploads.files")
      .find({ "metadata.companyId": user.companyId.toString() })
      .toArray();

    if (files.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        files: [],
        companyName: user.empresa,
        section: "todas",
      });
    }

    // Formatação dos dados dos arquivos
    const fileList = files.map((file) => ({
      filename: file.filename,
      originalName: file.metadata?.originalName || file.filename,
      size: file.length,
      length: file.length,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
      section: file.metadata?.section || "geral",
      downloadUrl: `/api/companies/${user.companyId}/files/${file.filename}`,
    }));

    res.status(200).json({
      success: true,
      count: files.length,
      files: fileList,
      companyName: user.empresa,
      section: "todas",
    });
  } catch (error) {
    console.error("Erro ao obter arquivos:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
};
