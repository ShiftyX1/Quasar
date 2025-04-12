const settings = require("../../../config/settings");

class UserController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await this.registerUserUseCase.execute(username, email, password);

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const result = await this.loginUserUseCase.execute(email, password);
      
      res.cookie('auth_token', result.token, settings.cookie);

      res.status(200).json({
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.clearCookie('auth_token', { 
      path: '/',
      ...settings.cookie 
    });
    res.status(200).json({ message: "Successfully logged out" });
  }

  async getCurrentUser(req, res) {
    res.status(200).json(req.user);
  }
}

module.exports = UserController; 