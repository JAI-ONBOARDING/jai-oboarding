const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

// Função para gerar JWT token
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Setup inicial - Criar primeiro admin (só funciona se não existir nenhum)
exports.setup = async (req, res) => {
  try {
    // Verificar se já existe algum admin
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(400).json({
        error: "Setup já foi realizado. Use a rota de login.",
      });
    }

    const { email, password, name } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Senha deve ter pelo menos 6 caracteres",
      });
    }

    // Criar admin
    const admin = new Admin({
      email: email.toLowerCase().trim(),
      password,
      name: name || "Administrador JAI",
    });

    await admin.save();

    // Gerar token
    const token = generateToken(admin._id);

    // Atualizar último login
    await admin.updateLastLogin();

    res.status(201).json({
      success: true,
      message: "Setup realizado com sucesso! Admin criado.",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Erro no setup:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email já existe",
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

// Login do admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Buscar admin por email
    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // Verificar se está ativo
    if (!admin.isActive) {
      return res.status(401).json({
        error: "Admin desativado. Contate o suporte",
      });
    }

    // Verificar senha
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // Gerar token
    const token = generateToken(admin._id);

    // Atualizar último login
    await admin.updateLastLogin();

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

// Obter dados do admin logado
exports.me = async (req, res) => {
  try {
    // req.admin já vem do middleware de auth
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados do admin:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

// Logout (opcional - apenas limpa token no frontend)
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout realizado. Remova o token do frontend.",
  });
};
