const Company = require("../models/CompanyModel");
const User = require("../models/UserModel");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// Função de validação reutilizável
const validateCompanyData = (companyData) => {
  const validationErrors = [];

  // Validação dos dados da empresa
  if (!companyData.company) {
    validationErrors.push("Dados da empresa");
  } else {
    const company = companyData.company;
    if (!company.nomeEmpresa || company.nomeEmpresa.trim() === "") {
      validationErrors.push("Nome da empresa");
    }
    if (!company.cnpj || company.cnpj.trim() === "") {
      validationErrors.push("CNPJ");
    }
    if (!company.emailContato || company.emailContato.trim() === "") {
      validationErrors.push("Email de contato");
    }
    if (!company.emailNotaFiscal || company.emailNotaFiscal.trim() === "") {
      validationErrors.push("Email para nota fiscal");
    }
    if (!company.telefone || company.telefone.trim() === "") {
      validationErrors.push("Telefone");
    }
    if (!company.responsavelGeral || company.responsavelGeral.trim() === "") {
      validationErrors.push("Responsável geral");
    }
  }

  // Validação do responsável financeiro
  if (!companyData.responsavelFinanceiro) {
    validationErrors.push("Dados do responsável financeiro");
  } else {
    const financeiro = companyData.responsavelFinanceiro;
    if (!financeiro.nome || financeiro.nome.trim() === "") {
      validationErrors.push("Nome do responsável financeiro");
    }
    if (!financeiro.email || financeiro.email.trim() === "") {
      validationErrors.push("Email do responsável financeiro");
    }
    if (!financeiro.telefone || financeiro.telefone.trim() === "") {
      validationErrors.push("Telefone do responsável financeiro");
    }
  }

  // Validação do responsável operacional
  if (!companyData.responsavelOperacao) {
    validationErrors.push("Dados do responsável operacional");
  } else {
    const operacao = companyData.responsavelOperacao;
    if (!operacao.nome || operacao.nome.trim() === "") {
      validationErrors.push("Nome do responsável operacional");
    }
    if (!operacao.email || operacao.email.trim() === "") {
      validationErrors.push("Email do responsável operacional");
    }
    if (!operacao.telefone || operacao.telefone.trim() === "") {
      validationErrors.push("Telefone do responsável operacional");
    }
  }

  // Validação do contrato
  if (companyData.contratoAceito !== true) {
    validationErrors.push("Aceite do contrato");
  }

  // Validação do tipo de integração
  if (!companyData.integracaoTipo || companyData.integracaoTipo.trim() === "") {
    validationErrors.push("Tipo de integração");
  }

  return validationErrors;
};

let gridFSBucket;
const conn = mongoose.connection;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

// Criação de nova empresa no sistema
exports.createCompany = async (req, res) => {
  try {
    const companyData = req.body;
    const userId = req.user.id;



    if (!companyData) {
      return res.status(400).json({
        error: "Dados da empresa são obrigatórios",
      });
    }

    // Validação detalhada de campos obrigatórios
    const validationErrors = validateCompanyData(companyData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios não preenchidos",
        details: validationErrors,
        missingFields: validationErrors,
      });
    }

    // Verificação da existência do usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    // Verificação se o usuário já possui empresa válida
    if (user.companyId) {
      // Verificar se a empresa ainda existe
      const existingCompany = await Company.findById(user.companyId);
      if (existingCompany) {
        return res.status(400).json({
          error:
            "Usuário já possui uma empresa cadastrada. Use a rota de atualização para modificar dados existentes.",
          existingCompanyId: user.companyId,
          suggestion:
            "Use PUT /api/companies/update para atualizar dados existentes",
        });
      } else {
        // Se a empresa não existe mais, remover a referência inválida
        user.companyId = undefined;
        await user.save();
      }
    }

    const newCompany = new Company(companyData);

    await newCompany.save({ validateBeforeSave: false });

    // Associação da empresa ao usuário
    user.companyId = newCompany._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Company criada com sucesso",
      id: newCompany._id,
      company: newCompany,
    });
  } catch (error) {
    console.error("Erro ao criar company:", error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

// Listagem de todas as empresas
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ "company.nomeEmpresa": 1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies: companies,
    });
  } catch (error) {
    console.error("Erro ao listar companies:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

// Busca de empresa por nome completo
exports.getCompanyByNomeCompleto = async (req, res) => {
  try {
    const nome = req.params.nome;
    const company = await Company.findOne({ "company.nomeEmpresa": nome });

    if (!company) {
      return res.status(404).json({
        error: "Empresa não encontrada",
      });
    }


    res.status(200).json({
      success: true,
      company: company,
    });
  } catch (error) {
    console.error("Erro ao buscar company:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

// Busca de empresa por ID
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        error: "Company não encontrada",
      });
    }


    res.status(200).json({
      success: true,
      company: company,
    });
  } catch (error) {
    console.error("Erro ao buscar company por ID:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Pode vir do middleware de autenticação

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID da company inválido",
      });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        error: "Company não encontrada",
      });
    }

    // Verificar se o usuário tem permissão para esta empresa
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.companyId?.toString() !== id) {
        return res.status(403).json({
          error: "Sem permissão para acessar esta empresa",
        });
      }
    }
    // req.files agora contém arquivos de todos os campos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Nenhum arquivo foi enviado",
      });
    }



    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      contentType: file.contentType || file.mimetype,
      uploadDate: new Date(),
      companyId: id,
      section: file.fieldname || "geral", // Incluir seção
      downloadUrl: `/api/companies/${id}/files/${file.filename}`,
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} arquivo(s) enviado(s) com sucesso`,
      files: uploadedFiles,
      companyName: company.company?.nomeEmpresa || "Nome não informado",
    });
  } catch (error) {
    console.error("Erro no upload:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor durante o upload",
      details: error.message,
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { id, filename } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }



    // Primeiro, tentar buscar pelo filename exato
    let fileDoc = await conn.db.collection("uploads.files").findOne({
      filename: filename,
      "metadata.companyId": id,
    });

    // Se não encontrar, tentar buscar pelo nome original
    if (!fileDoc) {
      fileDoc = await conn.db.collection("uploads.files").findOne({
        "metadata.originalName": filename,
        "metadata.companyId": id,
      });
    }

    if (!fileDoc) {
      return res
        .status(404)
        .json({ error: "Arquivo não encontrado", filename, companyId: id });
    }



    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    res.set("Content-Length", fileDoc.length);
    res.set(
      "Content-Disposition",
      `attachment; filename="${
        fileDoc.metadata?.originalName || fileDoc.filename
      }"`
    );

    const downloadStream = gridFSBucket.openDownloadStreamByName(filename);

    downloadStream.on("error", (error) => {
      console.error("Erro no stream de download:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Erro durante o download", details: error.message });
      }
    });



    downloadStream.pipe(res);
  } catch (error) {
    console.error("Erro no download:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Erro interno do servidor durante o download",
        details: error.message,
      });
    }
  }
};

exports.listFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.query; // Permitir filtrar por seção

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }



    // Construir query com filtro por seção se especificado
    let query = { "metadata.companyId": id };
    if (section) {
      query["metadata.section"] = section;
    }

    const files = await conn.db
      .collection("uploads.files")
      .find(query)
      .toArray();

    if (!files || files.length === 0) {

      return res.status(200).json({
        success: true,
        message: "Nenhum arquivo encontrado",
        files: [],
        companyName: company.company?.nomeEmpresa || "Nome não informado",
        count: 0,
        section: section || "todas",
      });
    }

    const fileList = files.map((file) => ({
      filename: file.filename,
      originalName: file.metadata?.originalName || file.filename,
      size: file.length,
      length: file.length,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
      section: file.metadata?.section || "geral", // Incluir seção
      // Usar o filename do GridFS para download, mas mostrar o nome original
      downloadUrl: `/api/companies/${id}/files/${file.filename}`,
    }));



    res.status(200).json({
      success: true,
      count: files.length,
      files: fileList,
      companyName: company.company?.nomeEmpresa || "Nome não informado",
      section: section || "todas",
    });
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao listar arquivos",
      details: error.message,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user.id;

    // Buscar usuário e sua empresa
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!user.companyId) {
      return res
        .status(404)
        .json({ error: "Usuário não possui empresa cadastrada" });
    }

    const company = await Company.findById(user.companyId);
    if (!company) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket não inicializado" });
    }

    const fileDoc = await conn.db.collection("uploads.files").findOne({
      filename: filename,
      "metadata.companyId": user.companyId.toString(),
    });

    if (!fileDoc) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    await gridFSBucket.delete(fileDoc._id);



    res.status(200).json({
      success: true,
      message: "Arquivo deletado com sucesso",
      filename,
      companyName: company.company?.nomeEmpresa || "Nome não informado",
    });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao deletar arquivo",
      details: error.message,
    });
  }
};

// Atualizar dados da empresa existente
exports.updateCompany = async (req, res) => {
  try {
    const companyData = req.body;
    const userId = req.user.id;



    if (!companyData) {
      return res.status(400).json({
        error: "Dados da empresa são obrigatórios",
      });
    }

    // Verificar se o usuário existe e tem empresa
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

    // Buscar empresa existente
    const existingCompany = await Company.findById(user.companyId);
    if (!existingCompany) {
      // Se a empresa não existe mais, remover a referência inválida
      user.companyId = undefined;
      await user.save();

      return res.status(404).json({
        error:
          "Empresa não encontrada. A referência foi removida automaticamente.",
        suggestion: "Você pode criar uma nova empresa agora.",
      });
    }



    // Validação detalhada de campos obrigatórios
    const validationErrors = validateCompanyData(companyData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios não preenchidos",
        details: validationErrors,
        missingFields: validationErrors,
      });
    }

    // Atualizar empresa com novos dados
    const updatedCompany = await Company.findByIdAndUpdate(
      user.companyId,
      companyData,
      { new: true, runValidators: false }
    );



    res.status(200).json({
      success: true,
      message: "Empresa atualizada com sucesso",
      id: updatedCompany._id,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID da company inválido" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company não encontrada" });
    }

    let files = []; // Garantia de inicialização da variável

    if (gridFSBucket) {
      files = await conn.db
        .collection("uploads.files")
        .find({ "metadata.companyId": id })
        .toArray();

      for (const file of files) {
        try {
          await gridFSBucket.delete(file._id);
        } catch (err) {
          console.error(`Erro ao deletar arquivo ${file.filename}:`, err);
        }
      }
    }

    // Remover a referência da empresa de todos os usuários associados
    await User.updateMany({ companyId: id }, { $unset: { companyId: 1 } });

    await Company.findByIdAndDelete(id);



    res.status(200).json({
      success: true,
      message: "Company e arquivos deletados com sucesso",
      companyName: company.company?.nomeEmpresa || "Nome não informado",
      deletedFilesCount: files.length,
    });
  } catch (error) {
    console.error("Erro ao deletar company:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor ao deletar company",
      details: error.message,
    });
  }
};
