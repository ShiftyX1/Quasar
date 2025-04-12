import React from 'react';
import { Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Message } from '@/api/messages';
import { useAuth } from '@/hooks/useAuth';

const { Text } = Typography;

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user: currentUser } = useAuth();
  const isCurrentUser = message.user?.id === currentUser?.id;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex items-start gap-2 mb-4 ${
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <Avatar 
        icon={<UserOutlined />} 
        style={{ backgroundColor: isCurrentUser ? '#1890ff' : '#f56a00' }}
      />
      
      <div 
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-gray-100 rounded-tl-none'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <Text 
            strong 
            className={isCurrentUser ? 'text-blue-100' : 'text-gray-700'}
          >
            {message.user?.username || 'Пользователь'}
          </Text>
          <Text 
            className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}
          >
            {formatTime(message.createdAt)}
          </Text>
        </div>
        
        <Text className={isCurrentUser ? 'text-white' : 'text-gray-800'}>
          {message.content}
        </Text>
      </div>
    </div>
  );
};

export default MessageItem; 