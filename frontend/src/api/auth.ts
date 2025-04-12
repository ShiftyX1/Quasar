import api from './axios';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
}

export const register = async (data: RegisterParams): Promise<User> => {
  const response = await api.post<User>('/users/register', data);
  return response.data;
};

export const login = async (data: LoginParams): Promise<User> => {
  const response = await api.post<LoginResponse>('/users/login', data);
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post('/users/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>('/users/me');
    return response.data;
  } catch (error) {
    return null;
  }
}; 