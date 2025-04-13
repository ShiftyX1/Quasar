# Документация бэкенда Quasar Chat

## Введение

Данная документация описывает архитектуру и основные компоненты бэкенд-части проекта Quasar Chat. Quasar Chat — это платформа для создания корпоративных чатов, которая предоставляет удобное и бесплатное on-premise решение для организаций и образовательных учреждений.

## Технический стек

- **Node.js** — среда выполнения JavaScript
- **Express** — веб-фреймворк для создания API
- **Socket.IO** — библиотека для работы с WebSockets
- **Sequelize** — ORM для работы с базами данных
- **MySQL/PostgreSQL** — реляционные базы данных
- **JWT** — JSON Web Tokens для аутентификации
- **Bcrypt** — библиотека для хеширования паролей
- **Jest** — фреймворк для тестирования

## Архитектура

Бэкенд Quasar Chat построен на принципах чистой архитектуры (Clean Architecture), что обеспечивает разделение бизнес-логики от внешних слоёв и инфраструктурных деталей.

### Слои архитектуры

```
backend/
└── src/
    ├── domain/              # Бизнес-логика и модели
    │   ├── entities/        # Сущности (User, ChatRoom, Message, и т.д.)
    │   ├── interfaces/      # Интерфейсы репозиториев и сервисов
    │   └── usecases/        # Сценарии использования системы
    │
    ├── application/         # Координация доменных объектов
    │   └── controllers/     # Контроллеры для обработки запросов
    │
    ├── infrastructure/      # Реализация интерфейсов и внешние сервисы
    │   ├── datasources/     # Доступ к базе данных
    │   ├── repositories/    # Реализации репозиториев
    │   ├── security/        # Сервисы безопасности (JWT, Bcrypt)
    │   └── websockets/      # Реализация WebSocket-соединений
    │
    └── interfaces/          # Адаптеры для внешних интерфейсов
        ├── middlewares/     # Промежуточное ПО Express
        └── routes/          # Маршруты Express
```

## Основные компоненты

### Домен (Domain)

Содержит бизнес-логику и определяет сущности системы, не зависящие от внешних слоев.

#### Сущности (Entities)

- `User` — пользователь системы
- `ChatRoom` — комната чата
- `Message` — сообщение в чате
- `RoomMember` — связь между пользователем и комнатой

#### Сценарии использования (Use Cases)

- `RegisterUser` — регистрация нового пользователя
- `LoginUser` — вход пользователя в систему
- `CreateChatRoom` — создание новой комнаты
- `JoinChatRoom` — присоединение к комнате
- `SendMessage` — отправка сообщения
- `GetRoomMessages` — получение сообщений комнаты

### Приложение (Application)

Содержит контроллеры, которые координируют работу сценариев использования.

#### Контроллеры (Controllers)

- `UserController` — обработка запросов аутентификации
- `ChatRoomController` — обработка запросов к комнатам
- `MessageController` — обработка запросов к сообщениям
- `RoomMemberController` — обработка запросов к участникам комнат

### Инфраструктура (Infrastructure)

Содержит реализации интерфейсов домена, работу с внешними сервисами и базой данных.

#### Репозитории (Repositories)

- `UserRepositoryImpl` — работа с пользователями
- `ChatRoomRepositoryImpl` — работа с комнатами
- `MessageRepositoryImpl` — работа с сообщениями
- `RoomMemberRepositoryImpl` — работа с участниками комнат

#### Безопасность (Security)

- `JwtTokenGenerator` — создание и проверка JWT-токенов
- `BcryptPasswordHasher` — хеширование и проверка паролей

#### WebSockets

- `setupWebsockets` — настройка WebSocket-соединений для обмена сообщениями

### Интерфейсы (Interfaces)

Содержит адаптеры для взаимодействия с внешним миром.

#### Маршруты (Routes)

- `userRoutes` — маршруты для аутентификации
- `chatRoomRoutes` — маршруты для комнат
- `messageRoutes` — маршруты для сообщений
- `roomMemberRoutes` — маршруты для участников комнат

#### Middleware

- `authMiddleware` — проверка JWT-токенов
- `errorHandler` — обработка ошибок

## Аутентификация

### Процесс аутентификации

1. Пользователь отправляет учетные данные (email, пароль)
2. Сервер проверяет учетные данные
3. При успешной проверке, сервер генерирует JWT-токен
4. Токен отправляется клиенту в HTTP-only cookie
5. Клиент автоматически отправляет cookie с каждым запросом
6. Сервер проверяет токен через middleware

### Безопасность

- Пароли хранятся в зашифрованном виде (bcrypt)
- JWT-токены имеют срок действия
- Используются HTTP-only cookies для защиты от XSS
- CORS настроен для работы только с frontend-доменом

## API-маршруты

### Аутентификация

- `POST /api/users/register` — регистрация нового пользователя
- `POST /api/users/login` — вход в систему
- `POST /api/users/logout` — выход из системы
- `GET /api/users/me` — получение данных текущего пользователя

### Комнаты

- `POST /api/rooms` — создание новой комнаты
- `GET /api/rooms/owned` — получение созданных пользователем комнат
- `GET /api/rooms/:id` — получение комнаты по ID

### Участники комнат

- `POST /api/memberships/join` — присоединение к комнате
- `DELETE /api/memberships/:roomId` — выход из комнаты
- `GET /api/memberships/joined` — получение комнат, к которым присоединился пользователь
- `GET /api/memberships/room/:roomId` — получение участников комнаты

### Сообщения

- `POST /api/messages` — отправка сообщения
- `GET /api/messages/room/:roomId` — получение сообщений комнаты

## WebSockets

WebSocket-соединения используются для обмена сообщениями в реальном времени.

### События

- `join-room` — присоединение к комнате
- `leave-room` — выход из комнаты
- `message` — получение нового сообщения

## Модели данных

### User

```javascript
{
  id: String,            // UUID
  username: String,      // Имя пользователя
  email: String,         // Почта пользователя
  password: String,      // Хешированный пароль
  createdAt: Date,       // Дата создания
  updatedAt: Date        // Дата обновления
}
```

### ChatRoom

```javascript
{
  id: String,            // UUID
  name: String,          // Название комнаты
  accessCode: String,    // Код доступа
  ownerId: String,       // ID создателя
  createdAt: Date,       // Дата создания
  updatedAt: Date        // Дата обновления
}
```

### RoomMember

```javascript
{
  id: String,            // UUID
  userId: String,        // ID пользователя
  roomId: String,        // ID комнаты
  joinedAt: Date         // Дата присоединения
}
```

### Message

```javascript
{
  id: String,            // UUID
  roomId: String,        // ID комнаты
  senderId: String,      // ID отправителя
  text: String,          // Текст сообщения
  createdAt: Date        // Дата отправки
}
```

## База данных

Проект использует Sequelize ORM для работы с базой данных. Модели данных определены в `src/infrastructure/datasources/models`.

### Связи между таблицами

- User 1:N ChatRoom (один пользователь может создать много комнат)
- User N:M ChatRoom через RoomMember (пользователь может быть в нескольких комнатах)
- User 1:N Message (один пользователь может отправить много сообщений)
- ChatRoom 1:N Message (в одной комнате может быть много сообщений)

## Запуск и развертывание

### Требования

- Node.js 14+
- MySQL 5.7+ или PostgreSQL 10+

### Установка и настройка

1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Создать файл `.env` с настройками:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=quasar_chat
   DB_USER=root
   DB_PASSWORD=password
   JWT_SECRET=your_secret_key
   PORT=3001
   CLIENT_URL=http://localhost:3000
   ```
4. Создать базу данных
5. Запустить сервер: `npm start`

## Тестирование

Проект использует Jest для тестирования.

```bash
# Запуск всех тестов
npm test

# Запуск с покрытием
npm run test:coverage
``` 