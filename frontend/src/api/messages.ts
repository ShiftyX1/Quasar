import api from './axios';

export interface Message {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface SendMessageParams {
  content: string;
  roomId: string;
}

export const sendMessage = async (data: SendMessageParams): Promise<Message> => {
  const response = await api.post<Message>('/messages', data);
  return response.data;
};

export const getRoomMessages = async (roomId: string, limit = 50, offset = 0): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/messages/room/${roomId}`, {
    params: { limit, offset }
  });
  return response.data;
}; 