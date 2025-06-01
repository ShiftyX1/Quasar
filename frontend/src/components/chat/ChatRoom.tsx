import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { motion } from 'framer-motion';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RoomHeader from './RoomHeader';
import { getRoomMessages, sendMessage, Message } from '@/api/messages';
import { getRoomById, Room } from '@/api/rooms';
import socketClient from '@/lib/socket';

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
      } catch (err) {
        console.error('Failed to fetch room:', err);
        message.error('Не удалось загрузить информацию о комнате');
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getRoomMessages(roomId);
        setMessages(messagesData.reverse());
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        message.error('Не удалось загрузить историю сообщений');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    socketClient.init();
    socketClient.joinRoom(roomId);

    const messageHandler = (newMessage: Message) => {
      if (newMessage.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const connectionHandler = (connected: boolean) => {
      setIsConnected(connected);
    };

    const unsubscribeMessage = socketClient.onMessage(messageHandler);
    const unsubscribeConnection = socketClient.onConnectionChange(connectionHandler);

    return () => {
      socketClient.leaveRoom(roomId);
      unsubscribeMessage();
      unsubscribeConnection();
    };
  }, [roomId]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage({ content, roomId });
      socketClient.sendMessage({ content, roomId });
    } catch (err) {
      console.error('Failed to send message:', err);
      message.error('Не удалось отправить сообщение');
    }
  };

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка комнаты...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header комнаты - фиксированный */}
      <RoomHeader 
        room={room} 
        isConnected={isConnected} 
        showAccessCode={true}
      />
      
      {/* Список сообщений - скроллируемый */}
      <MessageList messages={messages} loading={isLoading} />
      
      {/* Поле ввода сообщения - фиксированное */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={!isConnected}
      />
    </div>
  );
};

export default ChatRoom; 