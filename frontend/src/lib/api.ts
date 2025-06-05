import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { AuthConfig, AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async getAuthConfig(): Promise<AuthConfig> {
    const response: AxiosResponse<{ success: boolean; data: AuthConfig }> = await this.client.get('/auth/config');
    return response.data.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<{ user: any }> = await this.client.post('/users/login', {
        email: credentials.username,
        password: credentials.password,
      });

      return {
        success: true,
        data: {
          user: response.data.user,
          token: 'cookie-based',
        },
      };
    } catch (error: any) {
      return this.handleAuthError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<any> = await this.client.post('/users/register', credentials);

      return {
        success: true,
        data: {
          user: response.data,
          token: 'registered',
        },
      };
    } catch (error: any) {
      return this.handleAuthError(error);
    }
  }

  async initSSO(): Promise<{ authUrl: string }> {
    const ssoUrl = `${window.location.origin}/api/auth/keycloak`;
    
    return { authUrl: ssoUrl };
  }

  async handleSSOCallback(code: string, state: string): Promise<AuthResponse> {
    try {
      const user = await this.getCurrentUser();
      
      return {
        success: true,
        data: {
          user,
          token: 'cookie-based',
        },
      };
    } catch (error: any) {
      return this.handleAuthError(error);
    }
  }

  async logout(): Promise<{ keycloakLogoutUrl?: string }> {
    try {
      const response: AxiosResponse<{ 
        message: string; 
        keycloakLogoutUrl?: string;
      }> = await this.client.post('/users/logout');
      
      return {
        keycloakLogoutUrl: response.data.keycloakLogoutUrl
      };
    } catch (error) {
      console.warn('Logout error:', error);
      return {};
    }
  }

  async validateToken(): Promise<AuthResponse> {
    try {
      const user = await this.getCurrentUser();
      
      return {
        success: true,
        data: {
          user,
          token: 'cookie-based',
        },
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        };
      }
      
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Token validation failed',
        },
      };
    }
  }

  async getCurrentUser(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/users/me');
    return response.data;
  }

  private handleAuthError(error: any): AuthResponse {
    if (error.response?.data) {
      const data = error.response.data;
      
      if (data.success === false && data.error) {
        return data;
      }
      
      if (data.error) {
        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: data.error,
          },
        };
      }
      
      if (data.message) {
        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: data.message,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred. Please try again.',
        details: error.message,
      },
    };
  }
}

export const apiClient = new ApiClient(); 