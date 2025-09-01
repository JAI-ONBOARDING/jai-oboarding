const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Company = require("../models/CompanyModel");

// Configuração do MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/jai-onboarding";

async function cleanupOrphanedReferences() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Buscar todos os usuários que têm companyId
    const usersWithCompanyId = await User.find({
      companyId: { $exists: true, $ne: null },
    });


    let cleanedCount = 0;

    for (const user of usersWithCompanyId) {
      // Verificar se a empresa ainda existe
      const company = await Company.findById(user.companyId);

      if (!company) {


        // Remover a referência inválida
        user.companyId = undefined;
        await user.save();

        cleanedCount++;
      }
    }


  } catch (error) {
    console.error("Erro durante a limpeza:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  cleanupOrphanedReferences()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erro no script de limpeza:", error);
      process.exit(1);
    });
}

module.exports = cleanupOrphanedReferences;
