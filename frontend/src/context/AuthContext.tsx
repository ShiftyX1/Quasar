import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/api/auth';
import { User, LoginParams, RegisterParams } from '@/api/auth';
import { getJoinedRooms } from '@/api/rooms';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginParams) => Promise<void>;
  register: (data: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (data: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await authApi.login(data);
      setUser(loggedUser);
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterParams) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authApi.register(data);
      setUser(newUser);
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 