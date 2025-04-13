# Документация API

## Базовый URL

```
http://localhost:3001/api
```

Для production:

```
https://quasar-chat-api.example.com/api
```

## Аутентификация

Quasar Chat использует аутентификацию с помощью JWT (JSON Web Token). Токены передаются через HTTP-only cookies.

### Регистрация пользователя

Регистрация нового пользователя в системе.

**URL**: `/users/register`

**Метод**: `POST`

**Требуется аутентификация**: Нет

**Тело запроса**:

```json
{
  "username": "johnsmith",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johnsmith",
  "email": "john@example.com",
  "createdAt": "2023-04-12T14:22:18.162Z"
}
```

**Код статуса**: 201 Created

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "All fields are required"
}
```

- 409 Conflict - Если имя пользователя или email уже существуют

```json
{
  "message": "Email already in use"
}
```

### Вход пользователя

Аутентификация пользователя и получение токена.

**URL**: `/users/login`

**Метод**: `POST`

**Требуется аутентификация**: Нет

**Тело запроса**:

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johnsmith",
  "email": "john@example.com"
}
```

**Код статуса**: 200 OK

**Cookies**:

- `auth_token` - JWT токен (HTTP only, secure в production)

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "Email and password are required"
}
```

- 401 Unauthorized - Если учетные данные неверны

```json
{
  "message": "Invalid email or password"
}
```

### Выход пользователя

Выход текущего аутентифицированного пользователя.

**URL**: `/users/logout`

**Метод**: `POST`

**Требуется аутентификация**: Да

**Успешный ответ**:

```json
{
  "message": "Logged out successfully"
}
```

**Код статуса**: 200 OK

**Cookies**:

- `auth_token` - Очищается

### Получение текущего пользователя

Получение профиля текущего аутентифицированного пользователя.

**URL**: `/users/me`

**Метод**: `GET`

**Требуется аутентификация**: Да

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johnsmith",
  "email": "john@example.com",
  "createdAt": "2023-04-12T14:22:18.162Z"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

## Чат-комнаты

### Создание комнаты

Создание новой чат-комнаты.

**URL**: `/rooms`

**Метод**: `POST`

**Требуется аутентификация**: Да

**Тело запроса**:

```json
{
  "name": "Engineering Team",
  "description": "Room for engineering team discussions"
}
```

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Engineering Team",
  "description": "Room for engineering team discussions",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2023-04-12T15:22:18.162Z"
}
```

**Код статуса**: 201 Created

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "Room name is required"
}
```

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

### Получение всех комнат

Получение всех чат-комнат, членом которых является пользователь.

**URL**: `/rooms`

**Метод**: `GET`

**Требуется аутентификация**: Да

**Успешный ответ**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Engineering Team",
    "description": "Room for engineering team discussions",
    "createdBy": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2023-04-12T15:22:18.162Z",
    "memberCount": 5,
    "unreadMessages": 3
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "General",
    "description": "General company discussions",
    "createdBy": "550e8400-e29b-41d4-a716-446655440003",
    "createdAt": "2023-04-10T10:15:26.321Z",
    "memberCount": 25,
    "unreadMessages": 0
  }
]
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

### Получение комнаты по ID

Получение информации о конкретной чат-комнате по ID.

**URL**: `/rooms/:id`

**Метод**: `GET`

**Требуется аутентификация**: Да

**Параметры URL**:

- `id` - ID чат-комнаты

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Engineering Team",
  "description": "Room for engineering team discussions",
  "createdBy": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johnsmith"
  },
  "createdAt": "2023-04-12T15:22:18.162Z",
  "members": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johnsmith",
      "role": "admin"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "username": "janedoe",
      "role": "member"
    }
  ]
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является членом комнаты

```json
{
  "message": "You are not a member of this room"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

### Обновление комнаты

Обновление существующей чат-комнаты.

**URL**: `/rooms/:id`

**Метод**: `PUT`

**Требуется аутентификация**: Да

**Тело запроса**:

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated description for engineering team discussions"
}
```

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Updated Engineering Team",
  "description": "Updated description for engineering team discussions",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2023-04-12T15:22:18.162Z",
  "updatedAt": "2023-04-13T09:45:12.789Z"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является администратором комнаты

```json
{
  "message": "Only room admins can update room details"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

### Удаление комнаты

Удаление чат-комнаты.

**URL**: `/rooms/:id`

**Метод**: `DELETE`

**Требуется аутентификация**: Да

**Параметры URL**:

- `id` - ID чат-комнаты

**Успешный ответ**:

```json
{
  "message": "Room deleted successfully"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является администратором комнаты

```json
{
  "message": "Only room admins can delete rooms"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

## Участники комнат

### Добавление участника в комнату

Добавление пользователя в чат-комнату.

**URL**: `/rooms/:roomId/members`

**Метод**: `POST`

**Требуется аутентификация**: Да

**Тело запроса**:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440005",
  "role": "member" // Опционально: "admin" или "member", по умолчанию "member"
}
```

**Успешный ответ**:

```json
{
  "roomId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440005",
  "role": "member",
  "joinedAt": "2023-04-13T10:15:23.456Z"
}
```

**Код статуса**: 201 Created

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "User ID is required"
}
```

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является администратором комнаты

```json
{
  "message": "Only room admins can add members"
}
```

- 404 Not Found - Если комната или пользователь не существуют

```json
{
  "message": "Room or user not found"
}
```

- 409 Conflict - Если пользователь уже является участником комнаты

```json
{
  "message": "User is already a member of this room"
}
```

### Получение участников комнаты

Получение всех участников чат-комнаты.

**URL**: `/rooms/:roomId/members`

**Метод**: `GET`

**Требуется аутентификация**: Да

**Параметры URL**:

- `roomId` - ID чат-комнаты

**Успешный ответ**:

```json
[
  {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johnsmith",
    "role": "admin",
    "joinedAt": "2023-04-12T15:22:18.162Z"
  },
  {
    "userId": "550e8400-e29b-41d4-a716-446655440003",
    "username": "janedoe",
    "role": "member",
    "joinedAt": "2023-04-12T16:30:45.789Z"
  }
]
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является участником комнаты

```json
{
  "message": "You are not a member of this room"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

### Изменение роли участника

Изменение роли участника в чат-комнате.

**URL**: `/rooms/:roomId/members/:userId`

**Метод**: `PUT`

**Требуется аутентификация**: Да

**Параметры URL**:

- `roomId` - ID чат-комнаты
- `userId` - ID пользователя

**Тело запроса**:

```json
{
  "role": "admin"
}
```

**Успешный ответ**:

```json
{
  "roomId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440003",
  "role": "admin",
  "joinedAt": "2023-04-12T16:30:45.789Z",
  "updatedAt": "2023-04-13T11:45:32.123Z"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "Role must be either 'admin' or 'member'"
}
```

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является администратором комнаты

```json
{
  "message": "Only room admins can change member roles"
}
```

- 404 Not Found - Если комната или участник не существуют

```json
{
  "message": "Room member not found"
}
```

### Удаление участника из комнаты

Удаление пользователя из чат-комнаты.

**URL**: `/rooms/:roomId/members/:userId`

**Метод**: `DELETE`

**Требуется аутентификация**: Да

**Параметры URL**:

- `roomId` - ID чат-комнаты
- `userId` - ID пользователя

**Успешный ответ**:

```json
{
  "message": "Member removed successfully"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является администратором комнаты или не удаляет себя

```json
{
  "message": "Only room admins can remove other members"
}
```

- 404 Not Found - Если комната или участник не существуют

```json
{
  "message": "Room member not found"
}
```

## Сообщения

### Отправка сообщения

Отправка сообщения в чат-комнату.

**URL**: `/rooms/:roomId/messages`

**Метод**: `POST`

**Требуется аутентификация**: Да

**Тело запроса**:

```json
{
  "content": "Hello team! How is everyone doing today?"
}
```

**Успешный ответ**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "roomId": "550e8400-e29b-41d4-a716-446655440001",
  "senderId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Hello team! How is everyone doing today?",
  "createdAt": "2023-04-13T12:15:22.345Z"
}
```

**Код статуса**: 201 Created

**Ошибки**:

- 400 Bad Request - Если валидация запроса не пройдена

```json
{
  "message": "Message content is required"
}
```

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является участником комнаты

```json
{
  "message": "You are not a member of this room"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

### Получение сообщений комнаты

Получение сообщений из чат-комнаты.

**URL**: `/rooms/:roomId/messages`

**Метод**: `GET`

**Требуется аутентификация**: Да

**Параметры URL**:

- `roomId` - ID чат-комнаты

**Параметры запроса**:

- `limit` (опционально) - Количество сообщений для получения (по умолчанию: 50)
- `before` (опционально) - Получение сообщений до указанной отметки времени
- `after` (опционально) - Получение сообщений после указанной отметки времени

**Успешный ответ**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "roomId": "550e8400-e29b-41d4-a716-446655440001",
    "sender": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "username": "janedoe"
    },
    "content": "I'm doing great! Working on the new feature.",
    "createdAt": "2023-04-13T12:20:18.123Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "roomId": "550e8400-e29b-41d4-a716-446655440001",
    "sender": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "username": "bobwilliams"
    },
    "content": "Hello everyone!",
    "createdAt": "2023-04-13T12:17:45.678Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "roomId": "550e8400-e29b-41d4-a716-446655440001",
    "sender": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johnsmith"
    },
    "content": "Hello team! How is everyone doing today?",
    "createdAt": "2023-04-13T12:15:22.345Z"
  }
]
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является участником комнаты

```json
{
  "message": "You are not a member of this room"
}
```

- 404 Not Found - Если комната не существует

```json
{
  "message": "Room not found"
}
```

### Удаление сообщения

Удаление сообщения.

**URL**: `/rooms/:roomId/messages/:messageId`

**Метод**: `DELETE`

**Требуется аутентификация**: Да

**Параметры URL**:

- `roomId` - ID чат-комнаты
- `messageId` - ID сообщения

**Успешный ответ**:

```json
{
  "message": "Message deleted successfully"
}
```

**Код статуса**: 200 OK

**Ошибки**:

- 401 Unauthorized - Если пользователь не аутентифицирован

```json
{
  "message": "Authentication required"
}
```

- 403 Forbidden - Если пользователь не является отправителем или администратором комнаты

```json
{
  "message": "Only the sender or room admins can delete messages"
}
```

- 404 Not Found - Если сообщение не существует

```json
{
  "message": "Message not found"
}
```

## События WebSocket

Quasar Chat также использует WebSockets для коммуникации в реальном времени. Подключение к WebSocket:

```
ws://localhost:3001
```

Для production:

```
wss://quasar-chat-api.example.com
```

### Аутентификация

После подключения к WebSocket, необходимо аутентифицироваться:

```javascript
// Клиент
socket.emit('authenticate', { token: 'your-jwt-token' });

// Ответ сервера при успехе
socket.on('authenticated', () => {
  console.log('Successfully authenticated');
});

// Ответ сервера при ошибке
socket.on('unauthorized', (error) => {
  console.error('Authentication failed:', error.message);
});
```

### События

#### Присоединение к комнате

Присоединение к чат-комнате для получения сообщений.

```javascript
// Клиент
socket.emit('join-room', { roomId: '550e8400-e29b-41d4-a716-446655440001' });

// Ответ сервера
socket.on('room-joined', (data) => {
  console.log(`Joined room ${data.roomId}`);
});
```

#### Выход из комнаты

Выход из чат-комнаты.

```javascript
// Клиент
socket.emit('leave-room', { roomId: '550e8400-e29b-41d4-a716-446655440001' });

// Ответ сервера
socket.on('room-left', (data) => {
  console.log(`Left room ${data.roomId}`);
});
```

#### Новое сообщение

Отправка нового сообщения в комнату.

```javascript
// Клиент
socket.emit('message', {
  roomId: '550e8400-e29b-41d4-a716-446655440001',
  content: 'Hello everyone!'
});

// Сервер рассылает всем участникам комнаты
socket.on('message', (message) => {
  console.log(`New message in room ${message.roomId}: ${message.content}`);
});
```

#### Индикатор набора

Отправка индикаторов набора текста.

```javascript
// Клиент (начало набора)
socket.emit('typing', {
  roomId: '550e8400-e29b-41d4-a716-446655440001',
  isTyping: true
});

// Клиент (окончание набора)
socket.emit('typing', {
  roomId: '550e8400-e29b-41d4-a716-446655440001',
  isTyping: false
});

// Сервер рассылает всем участникам комнаты
socket.on('typing', (data) => {
  console.log(`User ${data.username} is ${data.isTyping ? 'typing' : 'not typing'} in room ${data.roomId}`);
});
```

#### Статус пользователя

Получение обновлений статуса пользователя.

```javascript
// Сервер рассылает при изменении статуса пользователя
socket.on('user-status', (data) => {
  console.log(`User ${data.username} is now ${data.status}`);
});
```

#### Обновления комнаты

Получение обновлений комнаты.

```javascript
// Сервер рассылает при обновлении комнаты
socket.on('room-updated', (data) => {
  console.log(`Room ${data.roomId} has been updated`);
});

// Сервер рассылает при присоединении нового участника
socket.on('member-joined', (data) => {
  console.log(`User ${data.username} has joined room ${data.roomId}`);
});

// Сервер рассылает при выходе участника
socket.on('member-left', (data) => {
  console.log(`User ${data.username} has left room ${data.roomId}`);
});
```

## Обработка ошибок

API использует стандартные HTTP-коды статуса для указания успеха или неудачи запросов:

- `200 OK` - Запрос успешно выполнен
- `201 Created` - Новый ресурс успешно создан
- `400 Bad Request` - Запрос некорректен
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Клиент аутентифицирован, но не имеет прав доступа
- `404 Not Found` - Запрашиваемый ресурс не существует
- `409 Conflict` - Запрос конфликтует с текущим состоянием целевого ресурса
- `500 Internal Server Error` - Произошла непредвиденная ошибка на сервере

Все ответы об ошибках имеют следующую структуру:

```json
{
  "message": "Описание ошибки"
}
```

Некоторые ошибки могут включать дополнительные детали:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    },
    {
      "field": "password",
      "message": "Must be at least 8 characters long"
    }
  ]
}
``` 