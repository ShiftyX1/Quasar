import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RoomHeader from './RoomHeader';
import { getRoomMessages, sendMessage, Message } from '@/api/messages';
import { getRoomById, Room } from '@/api/rooms';
import socketClient from '@/lib/socket';

const { Content } = Layout;

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
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
    return null;
  }

  return (
    <Layout className="h-full flex flex-col">
      <RoomHeader 
        room={room} 
        isConnected={isConnected} 
        showAccessCode={true}
      />
      
      <Content className="flex-1 flex flex-col">
        <MessageList messages={messages} loading={isLoading} />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          // disabled={!isConnected}
        />
      </Content>
    </Layout>
  );
};

export default ChatRoom; 