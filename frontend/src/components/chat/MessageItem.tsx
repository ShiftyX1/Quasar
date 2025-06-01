import React, { useState } from 'react';
import { Typography, Avatar, Tooltip, Button } from 'antd';
import { UserOutlined, MoreOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Message } from '@/api/messages';
import { useAuth } from '@/hooks/useAuth';

const { Text } = Typography;

interface MessageItemProps {
  message: Message;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isFirstInGroup = true, 
  isLastInGroup = true 
}) => {
  const { user: currentUser } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentUser = message.user?.id === currentUser?.id;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getUserColor = (username: string) => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#0abde3', '#ffc048', '#ff5722', '#9c88ff', '#f368e0'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 px-4 py-1 group ${
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      } ${isLastInGroup ? 'mb-4' : 'mb-1'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar (только для первого сообщения в группе) */}
      {isFirstInGroup && !isCurrentUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Avatar 
            size={32}
            style={{ 
              backgroundColor: getUserColor(message.user?.username || 'user'),
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            className="flex-shrink-0"
          >
            {(message.user?.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
        </motion.div>
      )}
      
      {/* Пустое место для выравнивания, если не первое сообщение */}
      {!isFirstInGroup && !isCurrentUser && (
        <div className="w-8" />
      )}

      {/* Контент сообщения */}
      <div 
        className={`relative max-w-[70%] group ${
          isCurrentUser ? 'ml-auto' : 'mr-auto'
        }`}
      >
        {/* Имя пользователя (только для первого сообщения в группе и не для текущего пользователя) */}
        {isFirstInGroup && !isCurrentUser && (
          <Text 
            className="text-xs font-medium mb-1 block"
            style={{ color: getUserColor(message.user?.username || 'user') }}
          >
            {message.user?.username || 'Пользователь'}
          </Text>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            relative rounded-2xl px-4 py-2 shadow-sm
            ${isCurrentUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }
            ${isFirstInGroup && isCurrentUser ? 'rounded-tr-md' : ''}
            ${isFirstInGroup && !isCurrentUser ? 'rounded-tl-md' : ''}
          `}
        >
          {/* Контент сообщения */}
          <div className="break-words">
            <Text 
              className={`${isCurrentUser ? 'text-white' : 'text-gray-800'} text-sm leading-relaxed`}
            >
              {message.content}
            </Text>
          </div>

          {/* Время */}
          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
            {formatTime(message.createdAt)}
          </div>

          {/* Статус доставки для собственных сообщений */}
          {isCurrentUser && (
            <div className="absolute bottom-1 right-2 flex items-center space-x-1">
              <div className="w-3 h-3 text-blue-100">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
              </div>
            </div>
          )}
        </motion.div>

        {/* Действия при наведении */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-0 flex space-x-1 ${
              isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'
            }`}
          >
            <Tooltip title="Копировать">
              <Button
                size="small"
                icon={<CopyOutlined />}
                className="rounded-full w-8 h-8 flex items-center justify-center border-0 bg-white shadow-md hover:bg-gray-50"
                onClick={handleCopyMessage}
              />
            </Tooltip>
            
            {isCurrentUser && (
              <Tooltip title="Удалить">
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  className="rounded-full w-8 h-8 flex items-center justify-center border-0 bg-white shadow-md hover:bg-red-50 text-red-500"
                />
              </Tooltip>
            )}
            
            <Tooltip title="Ещё">
              <Button
                size="small"
                icon={<MoreOutlined />}
                className="rounded-full w-8 h-8 flex items-center justify-center border-0 bg-white shadow-md hover:bg-gray-50"
              />
            </Tooltip>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem; 