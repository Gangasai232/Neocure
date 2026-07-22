import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, no token provided",
    });
  }

  try {
    // Validate token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied, admins only",
    });
  }
  next();
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  next();
};

const doctorOnly = authorizeRoles("doctor");
const patientOnly = authorizeRoles("patient");

export { verifyToken, authorizeRoles, adminOnly, doctorOnly, patientOnly };
