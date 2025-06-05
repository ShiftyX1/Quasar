const settings = require("../../../config/settings");

class UserController {
  constructor(registerUserUseCase, loginUserUseCase, logoutUserUseCase = null, getCurrentUserUseCase = null, updateUserProfileUseCase = null) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.logoutUserUseCase = logoutUserUseCase;
    this.getCurrentUserUseCase = getCurrentUserUseCase;
    this.updateUserProfileUseCase = updateUserProfileUseCase;
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
    try {
      res.clearCookie('auth_token', { 
        path: '/',
        ...settings.cookie 
      });

      if (this.logoutUserUseCase) {
        const result = await this.logoutUserUseCase.execute(req.token, req.user);
        
        if (result.keycloakLogoutUrl) {
          return res.status(200).json({ 
            message: "Successfully logged out",
            keycloakLogoutUrl: result.keycloakLogoutUrl
          });
        }
      }

      res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: "Logout failed" });
    }
  }

  async getCurrentUser(req, res) {
    try {
      if (this.getCurrentUserUseCase) {
        const user = await this.getCurrentUserUseCase.execute(req.user.id);
        return res.status(200).json(user);
      }
      
      res.status(200).json(req.user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: "Failed to get user information" });
    }
  }

  async updateProfile(req, res) {
    try {
      if (!this.updateUserProfileUseCase) {
        return res.status(500).json({ error: "Profile update service not available" });
      }

      const { firstName, lastName, avatarUrl } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).json({ error: "First name and last name are required" });
      }

      const updatedUser = await this.updateUserProfileUseCase.execute(req.user.id, {
        firstName,
        lastName,
        avatarUrl
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
}

module.exports = UserController; 