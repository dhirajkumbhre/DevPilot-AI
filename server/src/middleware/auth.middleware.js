import jwt from "jsonwebtoken";

/*
 * Authentication middleware
 *
 * This checks whether the request contains
 * a valid JWT token.
 */
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /*
     * Expected format:
     *
     * Authorization: Bearer <token>
     */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
     * Store decoded user information on the request.
     *
     * Controllers/services can access:
     * req.user.userId
     */
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authenticateUser;