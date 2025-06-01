'use client';
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { Card, Typography, Space, Button, Divider, Row, Col } from 'antd';
import { 
  MessageOutlined, 
  TeamOutlined, 
  PlusOutlined, 
  LoginOutlined,
  RocketOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import HomeNav from '@/components/home/HomeNav';

const { Title, Text, Paragraph } = Typography;

const WelcomeSection = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6"
        >
          <MessageOutlined className="text-3xl text-white" />
        </motion.div>
        
        <Title level={1} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Добро пожаловать в Quasar Chat
        </Title>
        
        <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
          Современный мессенджер для мгновенного общения в реальном времени. 
          Создавайте комнаты, общайтесь с друзьями и коллегами.
        </Paragraph>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Space size="large" className="mb-8">
          <Button 
            type="primary" 
            size="large" 
            icon={<LoginOutlined />}
            className="h-12 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            onClick={() => router.push('/auth/login')}
          >
            Войти в аккаунт
          </Button>
          <Button 
            size="large" 
            icon={<TeamOutlined />}
            className="h-12 px-8 rounded-lg border-2 hover:border-blue-500 transition-all"
            onClick={() => router.push('/auth/register')}
          >
            Создать аккаунт
          </Button>
        </Space>
      </motion.div>

      <Divider className="my-12" />

      <Row gutter={[32, 32]} className="max-w-4xl mx-auto">
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="text-center h-full hover:shadow-lg transition-shadow border-0 shadow-md">
              <RocketOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>Быстро и надежно</Title>
              <Text type="secondary">
                Мгновенная доставка сообщений с высокой производительностью
              </Text>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="text-center h-full hover:shadow-lg transition-shadow border-0 shadow-md">
              <SafetyOutlined className="text-4xl text-green-500 mb-4" />
              <Title level={4}>Безопасность</Title>
              <Text type="secondary">
                Защищенные комнаты с кодами доступа для приватного общения
              </Text>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="text-center h-full hover:shadow-lg transition-shadow border-0 shadow-md">
              <GlobalOutlined className="text-4xl text-purple-500 mb-4" />
              <Title level={4}>Доступность</Title>
              <Text type="secondary">
                Работает на любых устройствах с современным интерфейсом
              </Text>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

const UserDashboard = ({ user }: { user: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl"
    >
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2">
                Привет, {user.username}! 👋
              </Title>
              <Text className="text-lg text-gray-600">
                Готовы к общению? Выберите комнату или создайте новую.
              </Text>
            </div>
            <div className="hidden md:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
              >
                <MessageOutlined className="text-2xl text-white" />
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
      
      <HomeNav />
    </motion.div>
  );
};

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex items-center justify-center min-h-screen p-6">
        {user ? (
          <UserDashboard user={user} />
        ) : (
          <div className="w-full max-w-4xl">
            <WelcomeSection />
          </div>
        )}
      </div>
    </main>
  );
}
