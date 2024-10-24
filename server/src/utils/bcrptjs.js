import bcrypt from "bcryptjs";

export const hashPassword = (password) => {
  return bcrypt.hash(password);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};
