'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Dropdown, Button, Badge, Tooltip, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MenuProps } from 'antd';

const { Text } = Typography;

const UserNav = () => {
  const { user, logout } = useAuth();

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div className="py-1">
          <Text strong>Профиль</Text>
          <br />
          <Text type="secondary" className="text-xs">Управление аккаунтом</Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: (
        <div className="py-1">
          <Text>Настройки</Text>
          <br />
          <Text type="secondary" className="text-xs">Персонализация</Text>
        </div>
      ),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: (
        <div className="py-1">
          <Text>Уведомления</Text>
          <br />
          <Text type="secondary" className="text-xs">Управление оповещениями</Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <div className="py-1">
          <Text type="danger">Выйти</Text>
          <br />
          <Text type="secondary" className="text-xs">Завершить сеанс</Text>
        </div>
      ),
      onClick: () => logout(),
      className: 'hover:bg-red-50',
    },
  ];

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Space size="middle">
          <Link href="/auth/login">
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              className="rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Войти
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button 
              icon={<UserAddOutlined />}
              className="rounded-lg border-2 hover:border-blue-500 transition-all"
            >
              Регистрация
            </Button>
          </Link>
        </Space>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-4"
    >
      {/* Уведомления */}
      <Tooltip title="Уведомления">
        <Badge count={0} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all"
          />
        </Badge>
      </Tooltip>

      {/* Сообщения */}
      <Tooltip title="Сообщения">
        <Badge count={0} size="small">
          <Button
            type="text"
            icon={<MessageOutlined />}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all"
          />
        </Badge>
      </Tooltip>

      {/* Пользователь */}
      <Dropdown 
        menu={{ items: menuItems }} 
        placement="bottomRight"
        trigger={['click']}
        overlayClassName="user-dropdown"
        overlayStyle={{ marginTop: 8 }}
      >
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          <div className="relative">
            <Avatar 
              size={40}
              icon={<UserOutlined />} 
              className="shadow-md border-2 border-white"
              style={{ backgroundColor: '#1890ff' }} 
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="hidden md:block text-left">
            <Text strong className="block text-sm">
              {user.username}
            </Text>
            <Text type="secondary" className="text-xs">
              В сети
            </Text>
          </div>
        </motion.div>
      </Dropdown>
    </motion.div>
  );
};

export default UserNav; 