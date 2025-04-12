import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Form, Typography, Alert } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const { Title, Text } = Typography;

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login, error, loading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      await login(data);
    } catch (err) {
      setFormError('Ошибка при входе');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <Title level={2} className="text-center mb-6">
        Вход в аккаунт
      </Title>

      {(error || formError) && (
        <Alert
          message={error || formError}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Email"
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                placeholder="Пароль"
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
            Войти
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <Text>
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginForm; 