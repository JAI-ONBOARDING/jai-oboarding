const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password é obrigatório"],
      minlength: 6,
    },
    name: {
      type: String,
      default: "Administrador JAI",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash da senha antes de salvar
adminSchema.pre("save", async function (next) {
  // Só hash se a senha foi modificada
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senha
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para atualizar último login
adminSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
