const JwtTokenGenerator = require("../../infrastructure/security/JwtTokenGenerator");
const TokenBlacklistService = require("../../infrastructure/services/TokenBlacklistService");
const settings = require("../../../config/settings");

const tokenGenerator = new JwtTokenGenerator();
const tokenBlacklistService = new TokenBlacklistService(settings.redis);

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Проверяем, находится ли токен в черном списке
  const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
  if (isBlacklisted) {
    console.log('Blacklisted token attempt:', { token: token.substring(0, 20) + '...' });
    return res.status(401).json({ error: "Token has been revoked" });
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
  req.token = token; // Сохраняем токен для возможного использования в logout
  next();
};

module.exports = authMiddleware; 