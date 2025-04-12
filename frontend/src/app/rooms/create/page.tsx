'use client';

import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Form, Typography, Card, Alert, message } from 'antd';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/api/rooms';

const { Title } = Typography;

const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, 'Название комнаты должно содержать минимум 3 символа')
    .max(50, 'Название комнаты должно содержать максимум 50 символов'),
});

type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
    }
  });

  const onSubmit = async (data: CreateRoomFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const room = await createRoom(data);
      message.success(`Комната "${room.name}" успешно создана`);
      router.push('/');
    } catch (err: any) {
      console.error('Error creating room:', err);
      setError(err.response?.data?.error || 'Ошибка при создании комнаты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Создание новой комнаты
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
            label="Название комнаты"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Введите название комнаты"
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
              Создать комнату
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