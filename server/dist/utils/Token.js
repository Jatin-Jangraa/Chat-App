import jwt from 'jsonwebtoken';
export const generateToken = (userid) => jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
//# sourceMappingURL=Token.js.map