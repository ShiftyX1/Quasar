import React, { useState, KeyboardEvent } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="p-3 lg:p-4">
        <div className="flex items-end gap-2 lg:gap-3">
          {/* Дополнительные кнопки */}
          <div className="flex items-center space-x-1">
            <Tooltip title="Прикрепить файл">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                size="small"
                className="text-gray-500 hover:text-gray-700"
                disabled={disabled}
              />
            </Tooltip>
          </div>

          {/* Поле ввода */}
          <div className="flex-1">
            <Input.TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Подключение..." : "Введите сообщение..."}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="border border-gray-300 rounded-lg text-sm lg:text-base"
              disabled={disabled}
            />
          </div>

          {/* Emoji и отправка */}
          <div className="flex items-center space-x-1">
            <Tooltip title="Эмодзи">
              <Button
                type="text"
                icon={<SmileOutlined />}
                size="small"
                className="text-gray-500 hover:text-gray-700"
                disabled={disabled}
              />
            </Tooltip>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              className="rounded-lg"
              size="middle"
            />
          </div>
        </div>

        {/* Статус подключения */}
        {disabled && (
          <div className="mt-2 text-center">
            <span className="inline-flex items-center text-xs text-gray-500">
              <div className="animate-pulse w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              Подключение к серверу...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput; 