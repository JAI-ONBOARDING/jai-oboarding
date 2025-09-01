export const formatPhone = (value: string): string => {
  // Remove tudo que não for número
  let numeros = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  if (numeros.length > 11) numeros = numeros.slice(0, 11);

  // Formatação
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 6)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
      6
    )}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
};
