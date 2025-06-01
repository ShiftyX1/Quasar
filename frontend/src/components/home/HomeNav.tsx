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
      className="mb-6"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <Title level={4} className="m-0 flex items-center">
              <TeamOutlined className="mr-2 text-blue-500" /> 
              Быстрые действия
            </Title>
            {/* <Badge count={userRooms.length} showZero color="#1890ff">
              <NotificationOutlined className="text-gray-500" />
            </Badge> */}
          </div>
          
          <Space className="w-full" direction="vertical">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/rooms/create')}
              className="w-full h-12 rounded-lg shadow-md hover:shadow-lg transition-all"
              size="large"
            >
              Создать комнату
            </Button>
            
            <Button
              icon={<LoginOutlined />}
              onClick={() => router.push('/rooms/join')}
              className="w-full h-12 rounded-lg border-2 hover:border-blue-500 transition-all"
              size="large"
            >
              Присоединиться к комнате
            </Button>
          </Space>
        </div>
      </Card>
    </motion.div>
  );

  const RoomsList = () => (
    <Card className="border-0 shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0 flex items-center">
            <WechatOutlined className="mr-2 text-green-500" />
            Мои комнаты
            {userRooms.length > 0 && (
              <Badge 
                count={userRooms.length} 
                className="ml-2"
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Title>
          <Tooltip title="Настройки комнат">
            <Button type="text" icon={<SettingOutlined />} className="text-gray-500" />
          </Tooltip>
        </div>

        {userRooms.length > 3 && (
          <Input
            placeholder="Поиск комнат..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 rounded-lg"
            size="large"
          />
        )}
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <Text type="secondary">Загрузка комнат...</Text>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            <Text>{error}</Text>
          </div>
        </motion.div>
      ) : filteredRooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          {userRooms.length === 0 ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <WechatOutlined className="text-2xl text-gray-400" />
              </div>
              <div>
                <Text type="secondary" className="text-lg">У вас пока нет комнат</Text>
                <br />
                <Text type="secondary">Создайте первую комнату или присоединитесь к существующей</Text>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Text type="secondary">Комнаты не найдены</Text>
              <br />
              <Text type="secondary" className="text-sm">Попробуйте изменить поисковый запрос</Text>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <List
            dataSource={filteredRooms}
            renderItem={(room, index) => (
              <motion.div
                key={room.roomId || room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <List.Item
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-lg p-4 mb-2 border border-transparent hover:border-blue-200"
                  onClick={() => router.push(`/rooms/${room.roomId || room.id}`)}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="relative">
                        <Avatar
                          size={48}
                          className="shadow-md"
                          style={{ 
                            backgroundColor: `hsl(${(room.name.charCodeAt(0) * 137.508) % 360}, 70%, 50%)`,
                            border: '2px solid white'
                          }}
                        >
                          {room.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <Text strong className="text-lg">
                          {room.name}
                        </Text>
                        <LockOutlined className="text-gray-400 text-sm" />
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <Text type="secondary" className="flex items-center">
                          Код: <code className="ml-1 bg-gray-100 px-2 py-1 rounded text-xs">{room.accessCode}</code>
                        </Text>
                        <Text type="secondary" className="text-xs">
                          Последняя активность: недавно
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              </motion.div>
            )}
          />
        </motion.div>
      )}
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <QuickActions />
      <RoomsList />
    </motion.div>
  );
};

export default HomeNav; 