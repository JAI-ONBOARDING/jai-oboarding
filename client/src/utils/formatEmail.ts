export const validateEmail = (email: string): boolean => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

export const formatEmail = (value: string) => {
  value = value.trim().replace(/[^\w.@-]/g, "");
  return value.slice(0, 100);
};
