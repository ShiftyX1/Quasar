import React, { useEffect, useRef } from 'react';
import { Empty, Spin } from 'antd';
import MessageItem from './MessageItem';
import { Message } from '@/api/messages';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false 
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Empty description="Нет сообщений" />
      </div>
    );
  }

  return (
    <div className="px-4 py-3 overflow-y-auto flex-1">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList; 