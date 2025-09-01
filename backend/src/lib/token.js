import jwt from "jsonwebtoken";

export const genereateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
