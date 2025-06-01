import React from 'react';
import { Typography, Badge, Button, Tooltip, Space, Avatar, message, App } from 'antd';
import { 
  ArrowLeftOutlined, 
  CopyOutlined, 
  MoreOutlined,
  UserOutlined,
  LockOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Room } from '@/api/rooms';

const { Text, Title } = Typography;

interface RoomHeaderProps {
  room: Room;
  isConnected: boolean;
  showAccessCode?: boolean;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ 
  room, 
  isConnected,
  showAccessCode = false
}) => {
  const { message } = App.useApp();
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const copyAccessCode = () => {
    if (room.accessCode) {
      navigator.clipboard.writeText(room.accessCode);
      message.success('Код скопирован в буфер обмена');
    }
  };

  const getRoomColor = (name: string) => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between p-3 lg:p-4">
        {/* Левая часть */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Кнопка назад */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
            className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all flex-shrink-0"
          />

          {/* Аватар комнаты */}
          <div className="relative flex-shrink-0">
            <Avatar
              size={40}
              style={{ backgroundColor: getRoomColor(room.name) }}
              className="shadow-md w-9 h-9 lg:w-10 lg:h-10"
            >
              {room.name.charAt(0).toUpperCase()}
            </Avatar>
            <div className={`
              absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-white
              ${isConnected ? 'bg-green-500' : 'bg-red-500'}
            `}></div>
          </div>

          {/* Информация о комнате */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Title level={5} className="m-0 truncate text-sm lg:text-base">
                {room.name}
              </Title>
              <LockOutlined className="text-gray-400 text-xs flex-shrink-0" />
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <WifiOutlined className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <Text 
                  type="secondary" 
                  className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isConnected ? 'В сети' : 'Не в сети'}
                </Text>
              </div>
              
              {showAccessCode && (
                <>
                  <Text type="secondary" className="text-xs">•</Text>
                  <Text type="secondary" className="text-xs">
                    Приватная комната
                  </Text>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {showAccessCode && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
            >
              <Text className="text-xs lg:text-sm font-mono">
                {room.accessCode}
              </Text>
              <Tooltip title="Копировать код">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={copyAccessCode} 
                  type="text"
                  size="small"
                  className="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-all"
                />
              </Tooltip>
            </motion.div>
          )}

          {/* Код для мобильных */}
          {showAccessCode && (
            <Button 
              icon={<CopyOutlined />} 
              onClick={copyAccessCode} 
              type="text"
              size="small"
              className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            />
          )}

          {/* Дополнительные действия */}
          <Tooltip title="Дополнительно">
            <Button
              icon={<MoreOutlined />}
              type="text"
              className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            />
          </Tooltip>
        </div>
      </div>

      {/* Мобильный код доступа */}
      {showAccessCode && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <Text type="secondary" className="text-xs">
              Код доступа:
            </Text>
            <div className="flex items-center space-x-2">
              <Text className="text-sm font-mono">
                {room.accessCode}
              </Text>
              <Button 
                icon={<CopyOutlined />} 
                onClick={copyAccessCode} 
                type="text"
                size="small"
                className="w-6 h-6 flex items-center justify-center"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RoomHeader; 