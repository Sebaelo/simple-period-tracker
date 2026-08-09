import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies.Token;

  if (!token) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Invalid token verification: ", error);
    return res.status(401).json({
      error: "Invalid or expired token. Please log back in and try again.",
    });
  }
}
