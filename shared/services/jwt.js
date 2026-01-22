import jwt from "jsonwebtoken";

class JWT {
  create(payload) {
    return jwt.sign(payload);
  }

  check(token) {
    return jwt.verify(token);
  }

  decode(token) {
    return jwt.decode(token);
  }
}

export default JWT;

/**
 * Pending:
 * Adding secret key for tokens
 */
