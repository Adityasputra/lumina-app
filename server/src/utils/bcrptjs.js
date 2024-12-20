import bcrypt from "bcryptjs";

export const hashPassword = (password) => {
  return bcrypt.hashSync(password);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
