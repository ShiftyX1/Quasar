'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { RoomProvider } from '@/context/RoomContext';
import { Layout, ConfigProvider, App } from 'antd';
import { motion } from 'framer-motion';
import UserNav from '@/components/auth/UserNav';
import RoomsNavBar from '@/components/nav/RoomsNavBar';
import MobileNav from '@/components/nav/MobileNav';
import { useMediaQuery } from 'react-responsive';

const inter = Inter({ subsets: ['latin'] });

// Антдизайн тема в стиле современных мессенджеров
const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#ffffff',
      headerBg: '#ffffff',
      siderBg: '#fafafa',
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Button: {
      borderRadius: 8,
      primaryShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
    },
    Input: {
      borderRadius: 8,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ConfigProvider theme={themeConfig}>
          <App>
          <AuthProvider>
            <RoomProvider>
              <Layout className="h-screen overflow-hidden">
                {/* Модернизированный Header */}
                {isMobile && (
                <Layout.Header 
                  className="z-50 shadow-lg border-b border-gray-200 flex-shrink-0"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    padding: '0 24px',
                    height: '64px',
                    lineHeight: '64px'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center h-full"
                  >
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <MobileNav />
                      
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 lg:space-x-3"
                      >
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs lg:text-sm">Q</span>
                        </div>
                        <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Quasar Chat
                        </h1>
                      </motion.div>
                    </div>
                    <UserNav />
                  </motion.div>
                </Layout.Header>
                )}
                
                {/* Основной контент с сайдбаром */}
                <Layout hasSider className="flex-1 overflow-hidden">
                  <RoomsNavBar />
                  <Layout.Content 
                    className="flex-1 overflow-hidden"
                    style={{ 
                      background: 'transparent',
                      height: 'calc(100vh - 64px)'
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="h-full overflow-hidden"
                    >
                      {children}
                    </motion.div>
                  </Layout.Content>
                </Layout>
              </Layout>
            </RoomProvider>
          </AuthProvider>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}