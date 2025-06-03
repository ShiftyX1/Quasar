const JwtTokenGenerator = require("../../infrastructure/security/JwtTokenGenerator");
const tokenGenerator = new JwtTokenGenerator();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = tokenGenerator.verify(token);

  if (!decoded) {
    console.error('Invalid token provided');
    return res.status(401).json({ error: "Invalid token" });
  }

  console.log('Auth middleware - decoded user:', {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    authProvider: decoded.authProvider
  });

  req.user = decoded;
  next();
};

module.exports = authMiddleware; 