export const formatCNPJ = (value: string) => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  value = value.slice(0, 14);

  // Aplica máscara: 00.000.000/0000-00
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");

  return value;
};
