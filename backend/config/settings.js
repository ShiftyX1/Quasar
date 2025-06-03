require("dotenv").config({ path: ".env.dev" });

class Settings {
  constructor() {
    this.port = process.env.BACKEND_PORT || 3000;
    this.clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
    this.database = {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "chat_db",
      dialect: "postgres"
    };
    this.saltRounds = 10;
    this.cookie = {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      sameSite: 'strict'
    };

    this.keycloak = {
      enabled: process.env.KEYCLOAK_ENABLED === 'true',
      mode: process.env.KEYCLOAK_MODE || 'local-only',
      serverUrl: process.env.KEYCLOAK_SERVER_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      redirectUri: process.env.KEYCLOAK_REDIRECT_URI
    };

    this.redis = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0
    };

    this._validateConfig();
  }

  get isKeycloakEnabled() {
    return this.keycloak.enabled;
  }

  get authMode() {
    if (!this.keycloak.enabled) return 'local-only';
    return this.keycloak.mode;
  }

  get isLocalRegistrationAllowed() {
    return this.authMode !== 'sso-only';
  }

  get isKeycloakLoginAllowed() {
    return this.keycloak.enabled;
  }

  _validateConfig() {
    if (this.isKeycloakEnabled) {
      const requiredKeycloakFields = ['serverUrl', 'realm', 'clientId', 'clientSecret', 'redirectUri'];
      const missingFields = requiredKeycloakFields.filter(field => !this.keycloak[field]);
      
      if (missingFields.length > 0) {
        console.warn(`⚠️  Missing Keycloak configuration fields: ${missingFields.join(', ')}`);
        console.warn('Keycloak authentication may not work properly');
      }

      const validModes = ['local-only', 'hybrid', 'sso-only'];
      if (!validModes.includes(this.keycloak.mode)) {
        console.warn(`⚠️  Invalid KEYCLOAK_MODE: ${this.keycloak.mode}. Using 'hybrid' as fallback`);
        this.keycloak.mode = 'hybrid';
      }
    }
  }
}

module.exports = new Settings();
