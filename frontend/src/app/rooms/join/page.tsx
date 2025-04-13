'use client';

import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Form, Typography, Card, Alert, message } from 'antd';
import { useRouter } from 'next/navigation';
import { joinRoom } from '@/api/rooms';
import { useRooms } from '@/hooks/useRooms';

const { Title } = Typography;

const joinRoomSchema = z.object({
  accessCode: z
    .string()
    .min(6, 'Код доступа должен содержать минимум 6 символов')
    .max(20, 'Код доступа должен содержать максимум 20 символов'),
});

type JoinRoomFormValues = z.infer<typeof joinRoomSchema>;

export default function JoinRoomPage() {
  const router = useRouter();
  const { refreshRooms } = useRooms();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRoomFormValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      accessCode: '',
    }
  });

  const onSubmit = async (data: JoinRoomFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await joinRoom(data);
      await refreshRooms();
      message.success('Вы успешно присоединились к комнате');
      
      if (result.roomId) {
        router.push(`/rooms/${result.roomId}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.response?.data?.error || 'Ошибка при присоединении к комнате');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Присоединиться к комнате
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Код доступа"
            validateStatus={errors.accessCode ? 'error' : ''}
            help={errors.accessCode?.message}
          >
            <Controller
              name="accessCode"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Введите код доступа"
                  size="large"
                  {...field}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              Присоединиться
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              className="w-full"
              size="large"
              onClick={() => router.back()}
            >
              Назад
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 