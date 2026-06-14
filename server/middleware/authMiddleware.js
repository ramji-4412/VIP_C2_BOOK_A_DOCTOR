const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Check Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization token missing",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    console.log("Authorization Header:", authHeader);
    console.log("Token:", token);
    console.log("JWT_KEY:", process.env.JWT_KEY);

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Ensure body exists
    req.body = req.body || {};

    // Attach User ID
    req.body.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).send({
      success: false,
      message: "Invalid Token",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
