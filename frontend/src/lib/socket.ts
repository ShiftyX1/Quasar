import { io as socketIo, Socket as SocketType } from 'socket.io-client';
import { Message } from '@/api/messages';
import Cookies from 'js-cookie';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type EventHandler<T = any> = (data: T) => void;

class SocketClient {
  private socket: SocketType | null = null;
  private messageHandlers: EventHandler<Message>[] = [];
  private connectionHandlers: EventHandler<boolean>[] = [];

  public init(): void {
    if (this.socket) return;

    const token = Cookies.get('auth_token');

    this.socket = socketIo(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });

    this.setupListeners();
  }

  public disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  public joinRoom(roomId: string): void {
    if (!this.socket) return;
    this.socket.emit('join-room', roomId);
  }

  public leaveRoom(roomId: string): void {
    if (!this.socket) return;
    this.socket.emit('leave-room', roomId);
  }

  public sendMessage(message: { content: string; roomId: string }): void {
    if (!this.socket) return;
    this.socket.emit('send-message', message);
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to websocket server');
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from websocket server');
      this.notifyConnectionListeners(false);
    });

    this.socket.on('new-message', (message: Message) => {
      this.notifyMessageListeners(message);
    });

    this.socket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
      this.notifyConnectionListeners(false);
    });
  }

  public onMessage(handler: EventHandler<Message>): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  public onConnectionChange(handler: EventHandler<boolean>): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter((h) => h !== handler);
    };
  }

  private notifyMessageListeners(message: Message): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }
}

export const socketClient = new SocketClient();

export default socketClient; 