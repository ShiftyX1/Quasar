import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Form, Typography, Alert } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const { Title, Text } = Typography;

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя должно содержать максимум 20 символов'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { register: registerUser, error, loading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    try {
      const { username, email, password } = data;
      await registerUser({ username, email, password });
    } catch (err) {
      setFormError('Ошибка при регистрации');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <Title level={2} className="text-center mb-6">
        Регистрация
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
          label="Имя пользователя"
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Имя пользователя"
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

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

        <Form.Item
          label="Подтверждение пароля"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                placeholder="Подтверждение пароля"
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
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <Text>
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Войти
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default RegisterForm; 