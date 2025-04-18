'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { RoomProvider } from '@/context/RoomContext';
import { Layout } from 'antd';
import UserNav from '@/components/auth/UserNav';
import RoomsNavBar from '@/components/nav/RoomsNavBar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <RoomProvider>
            <Layout className="min-h-screen">
              <Layout.Header className="flex justify-between items-center bg-white shadow-sm px-6">
                <h1 className="text-xl font-bold">Quasar Chat</h1>
                <UserNav />
              </Layout.Header>
              <Layout hasSider>
                <RoomsNavBar />
                <Layout.Content>
                  {children}
                </Layout.Content>
              </Layout>
            </Layout>
          </RoomProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
