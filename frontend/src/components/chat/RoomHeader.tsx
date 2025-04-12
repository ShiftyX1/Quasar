import React from 'react';
import { PageHeader } from '@ant-design/pro-layout';
import { Typography, Badge, Button, Tooltip, Space } from 'antd';
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Room } from '@/api/rooms';

const { Text } = Typography;

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
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const copyAccessCode = () => {
    if (room.accessCode) {
      navigator.clipboard.writeText(room.accessCode);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <PageHeader
        onBack={handleBack}
        backIcon={<ArrowLeftOutlined />}
        title={
          <div className="flex items-center gap-2">
            <span>{room.name}</span>
            <Badge 
              status={isConnected ? "success" : "error"} 
              text={isConnected ? "В сети" : "Не в сети"} 
            />
          </div>
        }
        extra={
          showAccessCode && (
            <Space>
              <Text>Код: {room.accessCode}</Text>
              <Tooltip title="Копировать код">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={copyAccessCode} 
                  size="small"
                />
              </Tooltip>
            </Space>
          )
        }
      />
    </div>
  );
};

export default RoomHeader; 