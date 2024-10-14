export const validateEmail = (email: string) => {
  const atSymbolIndex = email.indexOf('@');
  if (atSymbolIndex < 1) {
    return false;
  }

  const dotIndex = email.lastIndexOf('.');
  if (dotIndex <= atSymbolIndex + 2) {
    return false;
  }

  if (dotIndex === email.length - 1) {
    return false;
  }

  return true;
};
