import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function verifyAdmin(req, res, next) {
  if (req.admin?.role === "admin") {
    return next();
  }
  res.status(403).json({ success: false, message: "Forbidden: Not an admin" });
}
