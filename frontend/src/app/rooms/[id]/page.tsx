'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ChatRoom from '@/components/chat/ChatRoom';
import { Spin } from 'antd';
import { motion } from 'framer-motion';

interface ChatRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <ChatRoom roomId={id} />
    </div>
  );
} 