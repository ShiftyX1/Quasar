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
      className="text-center max-w-4xl mx-auto"
    >
      <div className="mb-6 lg:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 lg:mb-6"
        >
          <MessageOutlined className="text-2xl lg:text-3xl text-white" />
        </motion.div>
        
        <Title level={1} className="mb-3 lg:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl lg:text-4xl">
          Добро пожаловать в Quasar Chat
        </Title>
        
        <Paragraph className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Современный мессенджер для мгновенного общения в реальном времени. 
          Создавайте комнаты, общайтесь с друзьями и коллегами.
        </Paragraph>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 lg:mb-8"
      >
        <Space 
          size="large" 
          className="flex-col sm:flex-row"
          wrap
        >
          <Button 
            type="primary" 
            size="large" 
            icon={<LoginOutlined />}
            className="h-11 lg:h-12 px-6 lg:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            onClick={() => router.push('/auth/login')}
          >
            Войти в аккаунт
          </Button>
          <Button 
            size="large" 
            icon={<TeamOutlined />}
            className="h-11 lg:h-12 px-6 lg:px-8 rounded-lg border-2 hover:border-blue-500 transition-all w-full sm:w-auto"
            onClick={() => router.push('/auth/register')}
          >
            Создать аккаунт
          </Button>
        </Space>
      </motion.div>

      <div className="hidden lg:block">
        <Divider className="my-8 lg:my-12" />

        <Row gutter={[16, 16]} className="max-w-4xl mx-auto">
          <Col xs={24} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow border-0 shadow-md">
                <RocketOutlined className="text-3xl lg:text-4xl text-blue-500 mb-3 lg:mb-4" />
                <Title level={4} className="text-base lg:text-lg">Быстро и надежно</Title>
                <Text type="secondary" className="text-sm lg:text-base">
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
                <SafetyOutlined className="text-3xl lg:text-4xl text-green-500 mb-3 lg:mb-4" />
                <Title level={4} className="text-base lg:text-lg">Безопасность</Title>
                <Text type="secondary" className="text-sm lg:text-base">
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
                <GlobalOutlined className="text-3xl lg:text-4xl text-purple-500 mb-3 lg:mb-4" />
                <Title level={4} className="text-base lg:text-lg">Доступность</Title>
                <Text type="secondary" className="text-sm lg:text-base">
                  Работает на любых устройствах с современным интерфейсом
                </Text>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
};

const UserDashboard = ({ user }: { user: any }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 mb-4 lg:mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Title level={2} className="mb-2 text-xl lg:text-2xl">
                Привет, {user.username}! 👋
              </Title>
              <Text className="text-base lg:text-lg text-gray-600">
                Готовы к общению? Выберите комнату или создайте новую.
              </Text>
            </div>
            <div className="hidden md:block ml-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
              >
                <MessageOutlined className="text-lg lg:text-2xl text-white" />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <div className="flex-1 overflow-hidden">
        <HomeNav />
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="h-full flex items-center justify-center p-4 lg:p-6">
        {user ? (
          <div className="w-full max-w-6xl h-full flex flex-col">
            <UserDashboard user={user} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-y-auto">
            <div className="w-full max-w-4xl py-8">
              <WelcomeSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
