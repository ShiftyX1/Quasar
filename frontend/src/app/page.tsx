'use client';
import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { Button, Form, Input, Typography, Checkbox, message } from 'antd';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Login values:', values);
      message.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Reset password for:', values.email);
      message.success('Password reset instructions sent to your email!');
    } catch (error) {
      console.error('Password reset failed:', error);
      message.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-blue-600 flex flex-col items-center justify-center p-8">
        <div className="mb-12">
          <Title level={1} className="text-white font-bold text-4xl">
            Chat<span className="text-blue-200">App</span>
          </Title>
          <Text className="text-white text-lg">Connect with people around the world</Text>
        </div>
        <div className="relative w-full max-w-md aspect-square">
          <div className="w-full h-full rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-white text-xl">Chat Illustration</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="mb-8">
                  <Title level={2}>Вход в систему</Title>
                  <Text className="text-gray-500">Введите свои данные для входа</Text>
                </div>

                <Form
                  name="login"
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                  requiredMark={false}
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Введите ваш email' },
                      { type: 'email', message: 'Введите корректный email' }
                    ]}
                  >
                    <Input 
                      placeholder="your@email.com" 
                      size="large" 
                      className="rounded-md"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                      { required: true, message: 'Введите ваш пароль' },
                      { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
                    ]}
                  >
                    <Input.Password 
                      placeholder="Ваш пароль" 
                      size="large" 
                      className="rounded-md"
                    />
                  </Form.Item>

                  <div className="flex justify-between items-center mb-6">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>
                    <button 
                      type="button" 
                      onClick={toggleForgotPassword} 
                      className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Войти
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-4">
                    <Text className="text-gray-500">
                      Нет аккаунта?{' '}
                      <Link href="/register" className="text-blue-600 hover:underline">
                        Зарегистрироваться
                      </Link>
                    </Text>
                  </div>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="forgotPassword"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="mb-8">
                  <Title level={2}>Восстановление пароля</Title>
                  <Text className="text-gray-500">Введите email для получения инструкций</Text>
                </div>

                <Form
                  name="forgotPassword"
                  layout="vertical"
                  onFinish={onForgotPasswordFinish}
                  autoComplete="off"
                  requiredMark={false}
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Введите ваш email' },
                      { type: 'email', message: 'Введите корректный email' }
                    ]}
                  >
                    <Input 
                      placeholder="your@email.com" 
                      size="large" 
                      className="rounded-md"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                    >
                      Отправить инструкции
                    </Button>
                    <Button
                      type="default"
                      size="large"
                      onClick={toggleForgotPassword}
                      className="w-full"
                    >
                      Вернуться к входу
                    </Button>
                  </Form.Item>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
