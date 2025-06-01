'use client';
import React, { useState } from 'react';
import { Card, Typography, List, Avatar, Button, Input, Badge, Tooltip, Space, Divider } from 'antd';
import { 
  WechatOutlined, 
  TeamOutlined, 
  PlusOutlined, 
  LoginOutlined, 
  SearchOutlined,
  SettingOutlined,
  NotificationOutlined,
  LockOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const HomeNav = () => {
  const { userRooms, loading, error } = useRooms();
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return null;
  }

  const filteredRooms = userRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const QuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 mb-4 lg:mb-6"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col space-y-3 lg:space-y-4">
          <div className="flex justify-between items-center">
            <Title level={4} className="m-0 flex items-center text-sm lg:text-base">
              <TeamOutlined className="mr-2 text-blue-500" /> 
              Быстрые действия
            </Title>
            {/* <Badge count={userRooms.length} showZero color="#1890ff">
              <NotificationOutlined className="text-gray-500" />
            </Badge> */}
          </div>
          
          <Space className="w-full" direction="vertical" size="small">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/rooms/create')}
              className="w-full h-10 lg:h-12 rounded-lg shadow-md hover:shadow-lg transition-all text-sm lg:text-base"
              size="large"
            >
              <span className="hidden sm:inline">Создать комнату</span>
              <span className="sm:hidden">Создать</span>
            </Button>
            
            <Button
              icon={<LoginOutlined />}
              onClick={() => router.push('/rooms/join')}
              className="w-full h-10 lg:h-12 rounded-lg border-2 hover:border-blue-500 transition-all text-sm lg:text-base"
              size="large"
            >
              <span className="hidden sm:inline">Присоединиться к комнате</span>
              <span className="sm:hidden">Присоединиться</span>
            </Button>
          </Space>
        </div>
      </Card>
    </motion.div>
  );

  const RoomsList = () => (
    <Card className="border-0 shadow-lg flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3 lg:mb-4">
        <div className="flex justify-between items-center mb-3 lg:mb-4">
          <Title level={4} className="m-0 flex items-center text-sm lg:text-base">
            <WechatOutlined className="mr-2 text-green-500" />
            <span className="hidden sm:inline">Мои комнаты</span>
            <span className="sm:hidden">Комнаты</span>
            {userRooms.length > 0 && (
              <Badge 
                count={userRooms.length} 
                className="ml-2"
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Title>
          <Tooltip title="Настройки комнат">
            <Button type="text" icon={<SettingOutlined />} className="text-gray-500" size="small" />
          </Tooltip>
        </div>

        {userRooms.length > 3 && (
          <Input
            placeholder="Поиск комнат..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg text-sm"
            size="middle"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 lg:py-8"
          >
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-blue-500"></div>
              <Text type="secondary" className="text-sm lg:text-base">Загрузка комнат...</Text>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 lg:py-8"
          >
            <div className="text-red-500 bg-red-50 p-3 lg:p-4 rounded-lg">
              <Text className="text-sm lg:text-base">{error}</Text>
            </div>
          </motion.div>
        ) : filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 lg:py-12"
          >
            {userRooms.length === 0 ? (
              <div className="space-y-3 lg:space-y-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <WechatOutlined className="text-xl lg:text-2xl text-gray-400" />
                </div>
                <div>
                  <Text type="secondary" className="text-base lg:text-lg block">У вас пока нет комнат</Text>
                  <Text type="secondary" className="text-xs lg:text-sm mt-1 block px-4">
                    Создайте первую комнату или присоединитесь к существующей
                  </Text>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Text type="secondary" className="text-sm lg:text-base">Комнаты не найдены</Text>
                <br />
                <Text type="secondary" className="text-xs lg:text-sm">Попробуйте изменить поисковый запрос</Text>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.roomId || room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-lg p-3 lg:p-4 border border-transparent hover:border-blue-200"
                onClick={() => router.push(`/rooms/${room.roomId || room.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      size={40}
                      className="shadow-md"
                      style={{ 
                        backgroundColor: `hsl(${(room.name.charCodeAt(0) * 137.508) % 360}, 70%, 50%)`,
                        border: '2px solid white'
                      }}
                    >
                      {room.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Text strong className="text-sm lg:text-lg truncate">
                        {room.name}
                      </Text>
                      <LockOutlined className="text-gray-400 text-xs lg:text-sm flex-shrink-0 ml-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Text type="secondary" className="text-xs lg:text-sm">
                          Код: 
                        </Text>
                        <code className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                          {room.accessCode}
                        </code>
                      </div>
                      <Text type="secondary" className="text-xs block">
                        Последняя активность: недавно
                      </Text>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col space-y-4 lg:space-y-6 overflow-hidden"
    >
      <QuickActions />
      <RoomsList />
    </motion.div>
  );
};

export default HomeNav; 