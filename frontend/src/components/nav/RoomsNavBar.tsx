import React, { useState } from 'react';
import { Layout, Menu, Spin, Typography, Input, Button, Avatar, Badge, Tooltip, Divider } from 'antd';
import { 
  WechatOutlined, 
  TeamOutlined, 
  SearchOutlined, 
  PlusOutlined,
  SettingOutlined,
  HomeOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const { Sider } = Layout;
const { Title, Text } = Typography;

const RoomsNavBar = () => {
  const { userRooms, loading, error } = useRooms();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    return null;
  }

  const filteredRooms = userRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInRoom = pathname.startsWith('/rooms/') && pathname !== '/rooms/create' && pathname !== '/rooms/join';
  
  if (!isInRoom && userRooms.length === 0) {
    return null;
  }

  const UserSection = () => (
    <div className="p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
      <div className="flex items-center space-x-2 lg:space-x-3">
        <div className="relative flex-shrink-0">
          <Avatar 
            size={collapsed ? 32 : 40}
            icon={<UserOutlined />}
            className="shadow-md"
            style={{ backgroundColor: '#1890ff' }}
          />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <Text strong className="block truncate text-sm lg:text-base">{user.username}</Text>
            <Text type="secondary" className="text-xs lg:text-sm">В сети</Text>
          </div>
        )}
        
        <div className="flex space-x-1">
          <Tooltip title="Уведомления">
            <Button type="text" size="small" icon={<BellOutlined />} className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8" />
          </Tooltip>
          <Tooltip title="Настройки">
            <Button type="text" size="small" icon={<SettingOutlined />} className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8" />
          </Tooltip>
        </div>
      </div>
    </div>
  );

  const NavigationSection = () => (
    <div className="p-2 lg:p-4 border-b border-gray-200 flex-shrink-0">
      <Menu
        mode="inline"
        selectedKeys={pathname === '/' ? ['home'] : []}
        className="border-0 bg-transparent"
        items={[
          {
            key: 'home',
            icon: <HomeOutlined className="text-sm lg:text-base" />,
            label: !collapsed && <span className="text-sm lg:text-base">Главная</span>,
            onClick: () => router.push('/'),
            className: 'rounded-lg mb-2 hover:bg-blue-50 h-8 lg:h-10'
          }
        ]}
      />
    </div>
  );

  const QuickActionsSection = () => (
    <div className="p-2 lg:p-4 border-b border-gray-200 flex-shrink-0">
      {!collapsed && (
        <div className="space-y-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/rooms/create')}
            className="w-full rounded-lg shadow-sm text-xs lg:text-sm h-8 lg:h-10"
            size="small"
          >
            Создать комнату
          </Button>
        </div>
      )}
      {collapsed && (
        <Tooltip title="Создать комнату" placement="right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/rooms/create')}
            className="w-full rounded-lg shadow-sm h-10"
          />
        </Tooltip>
      )}
    </div>
  );

  const RoomsSection = () => (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <div className="p-2 lg:p-4 pb-1 lg:pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          {!collapsed && (
            <Title level={5} className="m-0 text-gray-600 text-sm lg:text-base">
              Комнаты
            </Title>
          )}
          <Badge count={userRooms.length} size="small" />
        </div>
        
        {!collapsed && userRooms.length > 3 && (
          <Input
            placeholder="Поиск..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            className="rounded-lg text-xs lg:text-sm"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 lg:px-4 pb-2 lg:pb-4 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-16 lg:h-20">
            <Spin size="small" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-xs lg:text-sm p-2">{error}</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center text-gray-500 text-xs lg:text-sm p-2 lg:p-4">
            {searchTerm ? 'Комнаты не найдены' : 'Нет комнат'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredRooms.map((room, index) => {
              const isActive = pathname === `/rooms/${room.roomId || room.id}`;
              
              return (
                <motion.div
                  key={room.roomId || room.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    group cursor-pointer rounded-lg p-2 lg:p-3 transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300'
                    }
                  `}
                  onClick={() => router.push(`/rooms/${room.roomId || room.id}`)}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar
                        size={collapsed ? 28 : 36}
                        className="shadow-sm"
                        style={{ 
                          backgroundColor: `hsl(${(room.name.charCodeAt(0) * 137.508) % 360}, 70%, 50%)`,
                        }}
                      >
                        {room.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {isActive && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <Text 
                          strong={isActive}
                          className={`block truncate text-xs lg:text-sm ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                        >
                          {room.name}
                        </Text>
                        <Text 
                          type="secondary" 
                          className="text-xs truncate block"
                        >
                          {room.accessCode}
                        </Text>
                      </div>
                    )}
                  </div>
                  
                  {!collapsed && (
                    <div className="mt-1 lg:mt-2 flex items-center justify-between">
                      <Text type="secondary" className="text-xs">
                        Последняя активность
                      </Text>
                      <Badge 
                        size="small" 
                        count={0} 
                        showZero={false}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Sider
      width={280}
      theme="light"
      className="border-r border-gray-200 shadow-lg hidden lg:block"
      breakpoint="lg"
      collapsedWidth={80}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0
      }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col overflow-hidden"
      >
        <UserSection />
        <NavigationSection />
        <QuickActionsSection />
        <RoomsSection />
      </motion.div>
    </Sider>
  );
};

export default RoomsNavBar; 