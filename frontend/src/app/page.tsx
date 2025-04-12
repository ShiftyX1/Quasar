'use client';
import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { Button, Form, Input, Typography, Checkbox, message, Card, Space } from 'antd';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <Card className="w-full max-w-4xl p-6 md:p-10">
        <Title level={1} className="text-center mb-6">
          Добро пожаловать в Quasar Chat!
        </Title>
        
        {user ? (
          <div className="text-center">
            <Paragraph className="text-lg mb-6">
              Привет, <strong>{user.username}</strong>! Теперь вы можете создать комнату или присоединиться к существующей.
            </Paragraph>
            
            <Space size="large" className="mt-8">
              <Button type="primary" size="large" onClick={() => router.push('/rooms/create')}>
                Создать комнату
              </Button>
              <Button size="large" onClick={() => router.push('/rooms/join')}>
                Присоединиться к комнате
              </Button>
            </Space>
          </div>
        ) : (
          <div className="text-center">
            <Paragraph className="text-lg mb-6">
              Мгновенный обмен сообщениями в реальном времени. Регистрируйтесь или войдите, чтобы начать общение.
            </Paragraph>
            
            <Space size="large" className="mt-8">
              <Button type="primary" size="large" onClick={() => router.push('/auth/login')}>
                Войти
              </Button>
              <Button size="large" onClick={() => router.push('/auth/register')}>
                Регистрация
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </main>
  );
}
