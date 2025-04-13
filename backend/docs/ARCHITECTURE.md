# Архитектура бэкенда Quasar Chat

Бэкенд Quasar Chat построен на принципах Clean Architecture (Чистой архитектуры), что обеспечивает разделение бизнес-логики от внешних слоёв и инфраструктурных деталей. Такой подход позволяет достичь высокой тестируемости, гибкости и независимости от фреймворков.

## Основные принципы

1. **Независимость от фреймворков**: Бизнес-логика не зависит от существования какого-либо фреймворка.
2. **Тестируемость**: Бизнес-правила могут быть протестированы без UI, базы данных, веб-сервера или любого другого внешнего элемента.
3. **Независимость от UI**: UI может легко быть изменен без изменения остальной системы.
4. **Независимость от базы данных**: Бизнес-правила не привязаны к конкретной базе данных.
5. **Независимость от внешних агентов**: Бизнес-правила не знают ничего о внешнем мире.

## Слои архитектуры

### 1. Домен (Domain)

Центральный слой архитектуры, содержащий бизнес-логику и определяющий сущности системы.

#### 1.1. Сущности (Entities)

Сущности представляют основные бизнес-объекты системы:

- `User` — пользователь системы
- `ChatRoom` — комната чата
- `Message` — сообщение в чате
- `RoomMember` — связь между пользователем и комнатой

Пример сущности User:

```javascript
class User {
  constructor(id, username, email, password, createdAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }
}
```

#### 1.2. Интерфейсы репозиториев (Repository Interfaces)

Определяют контракты для доступа к данным:

- `UserRepository` — интерфейс для работы с пользователями
- `ChatRoomRepository` — интерфейс для работы с комнатами
- `MessageRepository` — интерфейс для работы с сообщениями
- `RoomMemberRepository` — интерфейс для работы с участниками комнат

Пример интерфейса UserRepository:

```javascript
class UserRepository {
  findById(id) {
    throw new Error("Method not implemented");
  }
  
  findByEmail(email) {
    throw new Error("Method not implemented");
  }
  
  findByUsername(username) {
    throw new Error("Method not implemented");
  }
  
  save(user) {
    throw new Error("Method not implemented");
  }
}
```

#### 1.3. Сценарии использования (Use Cases)

Сценарии использования определяют бизнес-правила приложения:

- `RegisterUser` — регистрация нового пользователя
- `LoginUser` — вход пользователя в систему
- `CreateChatRoom` — создание новой комнаты
- `JoinChatRoom` — присоединение к комнате
- `SendMessage` — отправка сообщения
- `GetRoomMessages` — получение сообщений комнаты

Пример сценария использования RegisterUser:

```javascript
class RegisterUser {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(userData) {
    // Проверка существования пользователя
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error("Email already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error("Username already in use");
    }

    // Хеширование пароля
    const hashedPassword = await this.passwordHasher.hash(userData.password);

    // Создание пользователя
    const user = new User(
      crypto.randomUUID(),
      userData.username,
      userData.email,
      hashedPassword,
      new Date()
    );

    // Сохранение пользователя
    return this.userRepository.save(user);
  }
}
```

### 2. Приложение (Application)

Слой, содержащий контроллеры, которые координируют работу сценариев использования.

#### 2.1. Контроллеры (Controllers)

- `UserController` — обработка запросов аутентификации
- `ChatRoomController` — обработка запросов к комнатам
- `MessageController` — обработка запросов к сообщениям
- `RoomMemberController` — обработка запросов к участникам комнат

Пример контроллера UserController:

```javascript
class UserController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      // Валидация данных
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Выполнение сценария использования
      const user = await this.registerUserUseCase.execute({ username, email, password });
      
      // Ответ клиенту
      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      // Валидация данных
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Выполнение сценария использования
      const { user, token } = await this.loginUserUseCase.execute({ email, password });
      
      // Установка cookie с токеном
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
      });
      
      // Ответ клиенту
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 3. Инфраструктура (Infrastructure)

Слой, содержащий реализации интерфейсов домена, работу с внешними сервисами и базой данных.

#### 3.1. Репозитории (Repositories)

- `UserRepositoryImpl` — реализация интерфейса UserRepository
- `ChatRoomRepositoryImpl` — реализация интерфейса ChatRoomRepository
- `MessageRepositoryImpl` — реализация интерфейса MessageRepository
- `RoomMemberRepositoryImpl` — реализация интерфейса RoomMemberRepository

Пример реализации UserRepositoryImpl:

```javascript
// Импорт интерфейса из домена
const UserRepository = require("../../domain/interfaces/UserRepository");
const User = require("../../domain/entities/User");

class UserRepositoryImpl extends UserRepository {
  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  async findById(id) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    
    return new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt
    );
  }

  async findByEmail(email) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) return null;
    
    return new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt
    );
  }

  async findByUsername(username) {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) return null;
    
    return new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt
    );
  }

  async save(user) {
    const [userModel, created] = await this.userModel.findOrCreate({
      where: { id: user.id },
      defaults: {
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt
      }
    });

    if (!created) {
      await userModel.update({
        username: user.username,
        email: user.email,
        password: user.password
      });
    }

    return new User(
      userModel.id,
      userModel.username,
      userModel.email,
      userModel.password,
      userModel.createdAt
    );
  }
}
```

#### 3.2. Безопасность (Security)

- `JwtTokenGenerator` — создание и проверка JWT-токенов
- `BcryptPasswordHasher` — хеширование и проверка паролей

Пример реализации BcryptPasswordHasher:

```javascript
const bcrypt = require("bcrypt");
const PasswordHasher = require("../../domain/interfaces/PasswordHasher");

class BcryptPasswordHasher extends PasswordHasher {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}
```

#### 3.3. Источники данных (Datasources)

Модели данных для ORM:

```javascript
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return User;
};
```

#### 3.4. WebSockets

Реализация WebSocket-соединений:

```javascript
function setupWebsockets(io) {
  io.on("connection", (socket) => {
    // Присоединение к комнате
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    // Выход из комнаты
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
    });

    // Обработка новых сообщений
    socket.on("message", (message) => {
      // Сохранение сообщения в базе данных
      // ...

      // Отправка сообщения всем участникам комнаты
      io.to(message.roomId).emit("message", message);
    });

    socket.on("disconnect", () => {
      // Обработка отключения
    });
  });
}
```

### 4. Интерфейсы (Interfaces)

Слой, содержащий адаптеры для взаимодействия с внешним миром.

#### 4.1. Маршруты (Routes)

- `userRoutes` — маршруты для аутентификации
- `chatRoomRoutes` — маршруты для комнат
- `messageRoutes` — маршруты для сообщений
- `roomMemberRoutes` — маршруты для участников комнат

Пример реализации userRoutes:

```javascript
const express = require("express");
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Регистрация нового пользователя
router.post("/register", userController.register);

// Вход в систему
router.post("/login", userController.login);

// Выход из системы
router.post("/logout", userController.logout);

// Получение текущего пользователя
router.get("/me", authMiddleware, userController.getCurrentUser);

module.exports = router;
```

#### 4.2. Middleware

- `authMiddleware` — проверка JWT-токенов
- `errorHandler` — обработка ошибок

Пример реализации authMiddleware:

```javascript
const JwtTokenGenerator = require("../../infrastructure/security/JwtTokenGenerator");

const authMiddleware = (req, res, next) => {
  try {
    // Получение токена из cookie
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Проверка токена
    const jwtTokenGenerator = new JwtTokenGenerator(process.env.JWT_SECRET);
    const payload = jwtTokenGenerator.verify(token);
    
    // Добавление пользователя в запрос
    req.user = payload;
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid authentication token" });
  }
};
```

## Конфигурация (Configuration)

Конфигурация приложения осуществляется через переменные окружения или файл .env:

```javascript
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || "quasar_chat",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret_key",
    expiresIn: "24h"
  },
  client: {
    url: process.env.CLIENT_URL || "http://localhost:3000"
  }
};
```

## Точка входа (Entry Point)

Файл app.js объединяет все компоненты и запускает сервер:

```javascript
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const config = require("./config");
const setupRoutes = require("./interfaces/routes");
const setupWebsockets = require("./infrastructure/websockets");
const errorHandler = require("./interfaces/middlewares/errorHandler");
const setupDatabase = require("./infrastructure/datasources/database");

// Создание приложения Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.client.url,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: config.client.url,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Настройка базы данных
setupDatabase();

// Настройка маршрутов
setupRoutes(app);

// Настройка WebSockets
setupWebsockets(io);

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Client URL: ${config.client.url}`);
});
```

## Преимущества архитектуры

1. **Модульность**: Компоненты можно легко заменять или модифицировать без влияния на другие части системы.
2. **Тестируемость**: Бизнес-логика может быть протестирована независимо от инфраструктуры.
3. **Масштабируемость**: Система легко масштабируется и расширяется.
4. **Гибкость**: Можно легко менять технологии (например, базу данных) без изменения бизнес-логики.
5. **Поддерживаемость**: Легко понять и поддерживать код, так как он организован в логические слои.

## Схема потока данных

1. **Входящий запрос**:
   - Запрос поступает на маршрут (routes)
   - Маршрут передает запрос соответствующему контроллеру

2. **Обработка в контроллере**:
   - Контроллер валидирует входные данные
   - Вызывает соответствующий сценарий использования (use case)

3. **Выполнение бизнес-логики**:
   - Сценарий использования применяет бизнес-правила
   - Взаимодействует с репозиториями через их интерфейсы

4. **Доступ к данным**:
   - Репозитории обращаются к источникам данных
   - Преобразуют данные из модели базы данных в доменные объекты

5. **Формирование ответа**:
   - Сценарий использования возвращает результат контроллеру
   - Контроллер формирует HTTP-ответ 