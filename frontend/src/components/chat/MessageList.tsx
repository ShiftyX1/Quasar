import React, { useEffect, useRef } from 'react';
import { Empty, Spin, Typography, Divider } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';
import { Message } from '@/api/messages';

const { Text } = Typography;

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false 
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupMessages = (messages: Message[]) => {
    const groups: Array<{
      date: string;
      messages: Array<{
        message: Message;
        isFirstInGroup: boolean;
        isLastInGroup: boolean;
      }>;
    }> = [];

    let currentGroup: Message[] = [];
    let currentDate = '';
    let currentUser = '';

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();
      const messageUser = message.user?.id || '';
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup.map((msg, idx) => ({
              message: msg,
              isFirstInGroup: idx === 0 || messages[messages.indexOf(msg) - 1]?.user?.id !== msg.user?.id,
              isLastInGroup: idx === currentGroup.length - 1 || messages[messages.indexOf(msg) + 1]?.user?.id !== msg.user?.id,
            }))
          });
        }
        currentGroup = [message];
        currentDate = messageDate;
        currentUser = messageUser;
      } else {
        currentGroup.push(message);
      }
    });

    // Добавляем последнюю группу
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup.map((msg, idx) => {
          const prevMessage = idx > 0 ? currentGroup[idx - 1] : null;
          const nextMessage = idx < currentGroup.length - 1 ? currentGroup[idx + 1] : null;
          
          return {
            message: msg,
            isFirstInGroup: !prevMessage || prevMessage.user?.id !== msg.user?.id,
            isLastInGroup: !nextMessage || nextMessage.user?.id !== msg.user?.id,
          };
        })
      });
    }

    return groups;
  };

  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spin size="large" />
          <div className="mt-4">
            <Text type="secondary">Загрузка сообщений...</Text>
          </div>
        </motion.div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <Text className="text-lg font-medium text-gray-600 block mb-2">
            Начните общение
          </Text>
          <Text type="secondary" className="text-sm">
            Отправьте первое сообщение, чтобы начать разговор в этой комнате
          </Text>
        </motion.div>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
      style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="py-4">
        <AnimatePresence>
          {messageGroups.map((group, groupIndex) => (
            <motion.div
              key={group.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Разделитель по дате */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <Text type="secondary" className="text-xs font-medium">
                    {formatDateDivider(group.date)}
                  </Text>
                </div>
              </div>

              {/* Сообщения в группе */}
              {group.messages.map(({ message, isFirstInGroup, isLastInGroup }, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.user?.id === messages[0]?.user?.id ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: (groupIndex * 0.1) + (messageIndex * 0.05),
                    duration: 0.3
                  }}
                >
                  <MessageItem 
                    message={message} 
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Индикатор печати (заготовка) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-2"
        >
          {/* Здесь может быть индикатор "пользователь печатает..." */}
        </motion.div>
      </div>
      
      <div ref={endRef} />
    </div>
  );
};

export default MessageList; 