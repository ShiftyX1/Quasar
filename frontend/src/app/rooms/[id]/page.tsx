'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ChatRoom from '@/components/chat/ChatRoom';
import { Spin } from 'antd';

interface ChatRoomPageProps {
  params: {
    id: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { id } = params;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <ChatRoom roomId={id} />
    </div>
  );
} 