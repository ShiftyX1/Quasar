import React from 'react';
import { Card, Typography, List, Avatar, Button } from 'antd';
import { WechatOutlined, TeamOutlined, PlusOutlined, LoginOutlined } from '@ant-design/icons';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const HomeNav = () => {
  const { userRooms, loading, error } = useRooms();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">
          <TeamOutlined className="mr-2" /> Мои комнаты
        </Title>
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/rooms/create')}
          >
            Создать
          </Button>
          <Button
            icon={<LoginOutlined />}
            onClick={() => router.push('/rooms/join')}
          >
            Присоединиться
          </Button>
        </div>
      </div>

      {loading ? (
        <div>Загрузка комнат...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : userRooms.length === 0 ? (
        <div className="text-center py-8">
          <Text type="secondary">У вас пока нет комнат</Text>
        </div>
      ) : (
        <List
          dataSource={userRooms}
          renderItem={(room) => (
            <List.Item
              key={room.roomId || room.id}
              className="cursor-pointer hover:bg-gray-50 transition rounded-md p-2"
              onClick={() => router.push(`/rooms/${room.roomId || room.id}`)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<WechatOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                }
                title={room.name}
                description={`Код доступа: ${room.accessCode}`}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default HomeNav; 