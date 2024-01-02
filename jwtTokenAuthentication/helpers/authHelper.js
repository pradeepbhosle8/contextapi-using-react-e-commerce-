import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saultRound = 10;
    const hashedPassword = await bcrypt.hash(password, saultRound);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
