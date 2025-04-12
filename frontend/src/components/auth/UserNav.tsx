import { useAuth } from '@/hooks/useAuth';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { MenuProps } from 'antd';

const UserNav = () => {
  const { user, logout } = useAuth();

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: () => logout(),
    },
  ];

  if (!user) {
    return (
      <div className="flex space-x-4">
        <Link href="/auth/login">
          <Button type="primary">Войти</Button>
        </Link>
        <Link href="/auth/register">
          <Button>Регистрация</Button>
        </Link>
      </div>
    );
  }

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="flex items-center cursor-pointer">
        <Avatar 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#1890ff' }} 
        />
        <span className="ml-2">{user.username}</span>
      </div>
    </Dropdown>
  );
};

export default UserNav; 