import { apiClient } from '../lib/api';
import type { AuthConfig, AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export class AuthService {
  private config: AuthConfig | null = null;

  async getAuthConfig(): Promise<AuthConfig> {
    if (!this.config) {
      this.config = await apiClient.getAuthConfig();
    }
    return this.config;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const config = await this.getAuthConfig();
    
    if (!config.showLocalAuth) {
      return {
        success: false,
        error: {
          code: 'LOCAL_AUTH_DISABLED',
          message: 'Local authentication is not available',
        },
      };
    }

    const response = await apiClient.login(credentials);
    
    if (response.success && response.data) {
      this.saveUserData(response.data.user);
    }
    
    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const config = await this.getAuthConfig();
    
    if (!config.showLocalAuth || !config.isLocalRegistrationAllowed) {
      return {
        success: false,
        error: {
          code: 'LOCAL_REGISTRATION_DISABLED',
          message: 'Local registration is not available',
        },
      };
    }

    const response = await apiClient.register(credentials);
    
    if (response.success && response.data) {
      const loginResponse = await this.login({
        username: credentials.email,
        password: credentials.password,
      });
      return loginResponse;
    }
    
    return response;
  }

  async initSSO(): Promise<string | null> {
    try {
      const config = await this.getAuthConfig();
      
      if (!config.showSSOAuth) {
        throw new Error('SSO authentication is not available');
      }

      const response = await apiClient.initSSO();
      return response.authUrl;
    } catch (error) {
      console.error('SSO initialization failed:', error);
      return null;
    }
  }

  async handleSSOCallback(code: string, state: string): Promise<AuthResponse> {
    const response = await apiClient.handleSSOCallback(code, state);
    
    if (response.success && response.data) {
      this.saveUserData(response.data.user);
    }
    
    return response;
  }

  async logout(): Promise<{ shouldRedirectToKeycloak?: boolean; keycloakLogoutUrl?: string }> {
    try {
      const result = await apiClient.logout();
      
      if (result.keycloakLogoutUrl) {
        this.clearUserData();
        return {
          shouldRedirectToKeycloak: true,
          keycloakLogoutUrl: result.keycloakLogoutUrl
        };
      }
      
      this.clearUserData();
      return {};
    } catch (error) {
      this.clearUserData();
      return {};
    }
  }

  async validateToken(): Promise<{ user: User; token: string } | null> {
    try {
      const response = await apiClient.validateToken();
      
      if (response.success && response.data) {
        this.saveUserData(response.data.user);
        return response.data;
      }
      
      if (response.error?.code === 'UNAUTHORIZED') {
        this.clearUserData();
        return null;
      }
      
      this.clearUserData();
      return null;
    } catch (error) {
      this.clearUserData();
      return null;
    }
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  getStoredToken(): string | null {
    return this.getStoredUser() ? 'cookie-based' : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  }

  private saveUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private clearUserData(): void {
    localStorage.removeItem('user_data');
  }

  getCachedAuthMethods(): { local: boolean; sso: boolean } | null {
    if (!this.config) return null;
    return {
      local: this.config.showLocalAuth,
      sso: this.config.showSSOAuth,
    };
  }

  async isSSORAvailable(): Promise<boolean> {
    try {
      const config = await this.getAuthConfig();
      return config.showSSOAuth;
    } catch (error) {
      return false;
    }
  }

  async isLocalAuthAvailable(): Promise<boolean> {
    try {
      const config = await this.getAuthConfig();
      return config.showLocalAuth;
    } catch (error) {
      return true;
    }
  }

  async isLocalRegistrationAvailable(): Promise<boolean> {
    try {
      const config = await this.getAuthConfig();
      return config.showLocalAuth && config.isLocalRegistrationAllowed;
    } catch (error) {
      return true;
    }
  }
}

export const authService = new AuthService(); 