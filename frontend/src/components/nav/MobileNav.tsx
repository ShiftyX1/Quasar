import React, { useState } from 'react';
import { Drawer, Button, Avatar, Typography, Space, List, Badge } from 'antd';
import { 
  MenuOutlined, 
  WechatOutlined, 
  TeamOutlined, 
  PlusOutlined,
  HomeOutlined,
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const { Text, Title } = Typography;

const MobileNav = () => {
  const { userRooms, loading } = useRooms();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerVisible, setDrawerVisible] = useState(false);

  if (!user) {
    return null;
  }

  const isInRoom = pathname.startsWith('/rooms/') && pathname !== '/rooms/create' && pathname !== '/rooms/join';
  
  if (!isInRoom && userRooms.length === 0) {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerVisible(false);
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

  return (
    <>
      {/* Кнопка меню (видна только на мобильных) */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-all"
      />

      {/* Мобильное меню */}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="280px"
        className="mobile-drawer"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Q</span>
                </div>
                <Text strong className="text-lg">Quasar Chat</Text>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setDrawerVisible(false)}
                className="w-8 h-8 flex items-center justify-center"
              />
            </div>
            
            {/* Пользователь */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar 
                  size={40}
                  icon={<UserOutlined />}
                  className="shadow-md"
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <Text strong className="block truncate">{user.username}</Text>
                <Text type="secondary" className="text-xs">В сети</Text>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <div className="p-4 border-b border-gray-200">
            <Space direction="vertical" className="w-full" size="small">
              <Button
                type={pathname === '/' ? 'primary' : 'default'}
                icon={<HomeOutlined />}
                onClick={() => handleNavigation('/')}
                className="w-full text-left justify-start h-10"
                ghost={pathname !== '/'}
              >
                Главная
              </Button>
              
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleNavigation('/rooms/create')}
                className="w-full text-left justify-start h-10"
              >
                Создать комнату
              </Button>
            </Space>
          </div>

          {/* Список комнат */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Title level={5} className="m-0 text-gray-600">
                  Мои комнаты
                </Title>
                <Badge count={userRooms.length} size="small" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {loading ? (
                <div className="text-center py-8">
                  <Text type="secondary">Загрузка...</Text>
                </div>
              ) : userRooms.length === 0 ? (
                <div className="text-center py-8">
                  <Text type="secondary" className="text-sm">
                    У вас пока нет комнат
                  </Text>
                </div>
              ) : (
                <div className="space-y-2">
                  {userRooms.map((room) => {
                    const isActive = pathname === `/rooms/${room.roomId || room.id}`;
                    
                    return (
                      <motion.div
                        key={room.roomId || room.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          cursor-pointer rounded-lg p-3 transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-100 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                          }
                        `}
                        onClick={() => handleNavigation(`/rooms/${room.roomId || room.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar
                              size={36}
                              className="shadow-sm"
                              style={{ 
                                backgroundColor: getUserColor(room.name),
                              }}
                            >
                              {room.name.charAt(0).toUpperCase()}
                            </Avatar>
                            {isActive && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Text 
                              strong={isActive}
                              className={`block truncate ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                            >
                              {room.name}
                            </Text>
                            <Text type="secondary" className="text-xs truncate block">
                              {room.accessCode}
                            </Text>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileNav; 