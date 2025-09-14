import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    // In development we use 'lax' to be more permissive for localhost requests.
    // In production, when frontend may be on a different origin, use 'none' and require secure.
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
