import jwt from "jsonwebtoken";

/*
 * Creates a JWT token for an authenticated user.
 *
 * The user's database ID is stored inside the token.
 */
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;