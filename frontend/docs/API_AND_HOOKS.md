# API и хуки фронтенда Quasar Chat

## API клиенты

API клиенты в Quasar Chat представляют собой модули, которые инкапсулируют логику взаимодействия с бэкендом. Они предоставляют типизированные функции для выполнения HTTP-запросов.

### Базовая конфигурация (axios.ts)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Аутентификация (auth.ts)

**Интерфейсы:**

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}
```

**Методы:**

```typescript
// Регистрация нового пользователя
export const register = async (data: RegisterParams): Promise<User> => {
  const response = await api.post<User>('/users/register', data);
  return response.data;
};

// Вход пользователя
export const login = async (data: LoginParams): Promise<User> => {
  const response = await api.post<User>('/users/login', data);
  return response.data;
};

// Выход пользователя
export const logout = async (): Promise<void> => {
  await api.post('/users/logout');
};

// Получение текущего пользователя
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};
```

### Комнаты (rooms.ts)

**Интерфейсы:**

```typescript
export interface Room {
  id: string;
  roomId?: string;
  name: string;
  accessCode: string;
  ownerId?: string;
  createdAt?: string;
  joinedAt?: string;
  userId?: string;
}

export interface CreateRoomParams {
  name: string;
}

export interface JoinRoomParams {
  accessCode: string;
}
```

**Методы:**

```typescript
// Создание новой комнаты
export const createRoom = async (data: CreateRoomParams): Promise<Room> => {
  const response = await api.post<Room>('/rooms', data);
  return response.data;
};

// Получение комнат, созданных пользователем
export const getOwnedRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>('/rooms/owned');
  return response.data;
};

// Получение комнаты по ID
export const getRoomById = async (roomId: string): Promise<Room> => {
  const response = await api.get<Room>(`/rooms/${roomId}`);
  return response.data;
};

// Присоединение к комнате по коду доступа
export const joinRoom = async (data: JoinRoomParams): Promise<{ roomId: string }> => {
  const response = await api.post<{ roomId: string }>('/memberships/join', data);
  return response.data;
};

// Получение комнат, к которым присоединился пользователь
export const getJoinedRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>('/memberships/joined');
  return response.data;
};

// Выход из комнаты
export const leaveRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/memberships/${roomId}`);
};
```

### Сообщения (messages.ts)

**Интерфейсы:**

```typescript
export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
  };
  text: string;
  createdAt: string;
}

export interface SendMessageParams {
  roomId: string;
  text: string;
}
```

**Методы:**

```typescript
// Получение сообщений комнаты
export const getRoomMessages = async (roomId: string): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/messages/room/${roomId}`);
  return response.data;
};

// Отправка нового сообщения
export const sendMessage = async (data: SendMessageParams): Promise<Message> => {
  const response = await api.post<Message>('/messages', data);
  return response.data;
};
```

## WebSocket (socket.ts)

Socket.io клиент используется для реализации обмена сообщениями в реальном времени:

```typescript
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
```

**Пример использования:**

```typescript
import socket from '@/lib/socket';

// Подключение к WebSocket
socket.connect();

// Подписка на события
socket.on('message', (message) => {
  console.log('New message:', message);
});

// Отправка событий
socket.emit('join-room', { roomId: '1234' });

// Отключение от WebSocket
socket.disconnect();
```

## Пользовательские хуки

### useAuth

Хук для доступа к контексту аутентификации.

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
```

**Пример использования:**

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, loading, login, register, logout, error } = useAuth();
  
  // Теперь можно использовать контекст аутентификации
  return (
    <div>
      {user ? (
        <button onClick={logout}>Выйти</button>
      ) : (
        <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
          Войти
        </button>
      )}
    </div>
  );
};
```

### useRooms

Хук для доступа к контексту комнат.

```typescript
import { useContext } from 'react';
import { RoomContext } from '@/context/RoomContext';

export const useRooms = () => {
  const context = useContext(RoomContext);
  
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  
  return context;
};
```

**Пример использования:**

```typescript
import { useRooms } from '@/hooks/useRooms';

const MyComponent = () => {
  const { userRooms, loading, error, refreshRooms, clearRooms } = useRooms();
  
  // Теперь можно использовать контекст комнат
  return (
    <div>
      <button onClick={refreshRooms}>Обновить список комнат</button>
      <ul>
        {userRooms.map(room => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Расширение API

### Добавление нового API клиента

Для добавления нового API клиента необходимо:

1. Создать файл в директории `src/api/`
2. Определить интерфейсы для данных и параметров
3. Реализовать функции для взаимодействия с бэкендом
4. Использовать axios для выполнения запросов

**Пример нового API клиента:**

```typescript
import api from './axios';

// Интерфейсы
export interface Profile {
  id: string;
  userId: string;
  avatar: string;
  bio: string;
}

export interface UpdateProfileParams {
  avatar?: string;
  bio?: string;
}

// Методы
export const getProfile = async (userId: string): Promise<Profile> => {
  const response = await api.get<Profile>(`/profiles/${userId}`);
  return response.data;
};

export const updateProfile = async (data: UpdateProfileParams): Promise<Profile> => {
  const response = await api.patch<Profile>('/profiles', data);
  return response.data;
};
```

### Обработка ошибок

Для обработки ошибок в API клиентах рекомендуется использовать try/catch:

```typescript
try {
  const result = await someApiCall();
  // Обработка успешного результата
} catch (error) {
  // Обработка ошибки
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || 'Произошла ошибка';
    // Отображение ошибки пользователю
  } else {
    console.error('Неизвестная ошибка:', error);
  }
}
```

## Создание нового хука

Для создания нового хука:

1. Создать файл в директории `src/hooks/`
2. Реализовать логику хука
3. При необходимости использовать существующие контексты или API клиенты

**Пример нового хука:**

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import * as profileApi from '@/api/profiles';

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const targetUserId = userId || user?.id;
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const profileData = await profileApi.getProfile(targetUserId);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [targetUserId]);
  
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const updatedProfile = await profileApi.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { profile, loading, error, updateProfile };
};
``` 