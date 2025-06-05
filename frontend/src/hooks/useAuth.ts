import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { needsProfileSetup } from '../lib/userHelpers';
import type { AuthState, AuthAction, LoginCredentials, RegisterCredentials } from '../types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  config: null,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const hasLoggedOut = useRef(false);

  const initialize = useCallback(async () => {
    console.log(state.isAuthenticated)
    if (hasLoggedOut.current) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const config = await authService.getAuthConfig();
      dispatch({ type: 'SET_CONFIG', payload: config });

      const authData = await authService.validateToken();
      if (authData) {
        hasLoggedOut.current = false;
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: authData.user, token: authData.token } 
        });
        
        if (needsProfileSetup(authData.user) && location.pathname !== '/profile-setup') {
          navigate('/profile-setup', { replace: true });
        }
      } else {
        hasLoggedOut.current = false;
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      hasLoggedOut.current = false;
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [navigate, location.pathname]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        hasLoggedOut.current = false;
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: response.data.user, token: response.data.token } 
        });
        
        if (needsProfileSetup(response.data.user)) {
          navigate('/profile-setup', { replace: true });
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
        
        return { success: true };
      } else {
        const errorMessage = response.error?.message || 'Login failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [navigate, location.state]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.register(credentials);
      
      if (response.success && response.data) {
        hasLoggedOut.current = false;
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: response.data.user, token: response.data.token } 
        });
        
        navigate('/profile-setup', { replace: true });
        
        return { success: true };
      } else {
        const errorMessage = response.error?.message || 'Registration failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  const loginWithSSO = useCallback(async () => {
    try {
      const authUrl = await authService.initSSO();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: 'SSO authentication is not available' 
        });
        return { success: false, error: 'SSO not available' };
      }
    } catch (error) {
      const errorMessage = 'Failed to initialize SSO';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const handleSSOCallback = useCallback(async (code: string, state: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.handleSSOCallback(code, state);
      
      if (response.success && response.data) {
        hasLoggedOut.current = false;
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: response.data.user, token: response.data.token } 
        });
        
        if (needsProfileSetup(response.data.user)) {
          navigate('/profile-setup', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        
        return { success: true };
      } else {
        const errorMessage = response.error?.message || 'SSO authentication failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during SSO authentication';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      hasLoggedOut.current = true;
      
      dispatch({ type: 'LOGOUT' });
      
      const logoutResult = await authService.logout();
      
      if (logoutResult.shouldRedirectToKeycloak && logoutResult.keycloakLogoutUrl) {
        window.location.href = logoutResult.keycloakLogoutUrl;
        return;
      }
      
      navigate('/auth', { replace: true });
    } catch (error) {
      console.warn('Logout error:', error);
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const authData = await authService.refreshUserData();
      
      if (authData) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: authData.user, token: authData.token } 
        });
        return authData.user;
      } else {
        dispatch({ type: 'LOGOUT' });
        return null;
      }
    } catch (error) {
      console.error('useAuth.refreshUserData failed:', error);
      return null;
    }
  }, []);

  const isLocalAuthAvailable = state.config?.showLocalAuth ?? true;
  const isSSORAvailable = state.config?.showSSOAuth ?? false;
  const isLocalRegistrationAvailable = state.config?.isLocalRegistrationAllowed ?? true;

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    config: state.config,
    isLocalAuthAvailable,
    isSSORAvailable,
    isLocalRegistrationAvailable,
    login,
    register,
    loginWithSSO,
    handleSSOCallback,
    logout,
    clearError,
    initialize,
    refreshUserData,
  };
} 