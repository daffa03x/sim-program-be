const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  const { password: _, refreshToken: __, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  const { password: _, refreshToken: __, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.refreshToken !== token) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
    return { accessToken: newAccessToken };
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken
};
