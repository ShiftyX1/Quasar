// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  authProvider: 'local' | 'keycloak';
  externalId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthConfig {
  keycloakEnabled: boolean;
  authMode: 'local-only' | 'hybrid' | 'sso-only';
  showLocalAuth: boolean;
  showSSOAuth: boolean;
  isLocalRegistrationAllowed: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  config: AuthConfig | null;
  error: string | null;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONFIG'; payload: AuthConfig }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }; 