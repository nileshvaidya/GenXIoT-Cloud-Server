declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB: string;
        JWT_KEY: string;
        PORT: string;
        JWT_KEY: string;
        FRONTEND_URL: string;
        HOST: string;
        NODE_ENV: string;
        MONGO_ROOT_USERNAME: string;
        MONGO_ROOT_PASSWORD: string;
        DB_NAME: string;
        MONGO_URI: string;
      }
    }
  }
  export {};