import React from 'react';
import { Layout, Menu, Spin, Empty, Typography } from 'antd';
import { WechatOutlined, TeamOutlined } from '@ant-design/icons';
import { useRooms } from '@/hooks/useRooms';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Sider } = Layout;
const { Title } = Typography;

const RoomsNavBar = () => {
  const { userRooms, loading, error } = useRooms();
  const router = useRouter();

  if (!loading && userRooms.length === 0) {
    return null;
  }

  const handleRoomSelect = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <Sider
      width={250}
      theme="light"
      className="border-r border-gray-200 shadow-sm"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="p-4 border-b border-gray-200">
        <Title level={5} className="m-0 flex items-center">
          <TeamOutlined className="mr-2" /> Мои комнаты
        </Title>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Spin />
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : (
        <Menu
          mode="inline"
          className="border-r-0"
          items={userRooms.map((room) => ({
            key: room.roomId || room.id,
            icon: <WechatOutlined />,
            label: room.name,
            onClick: () => handleRoomSelect(room.roomId || room.id),
          }))}
        />
      )}
    </Sider>
  );
};

export default RoomsNavBar; 