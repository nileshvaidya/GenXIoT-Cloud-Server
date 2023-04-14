import dotenv from 'dotenv';

dotenv.config();

export const DB = process.env.DB;
export const PORT = process.env.PORT!;
export const JWT_KEY = process.env.JWT_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const DB_NAME = process.env.DB_NAME;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const HOST = process.env.HOST;
export const config = {
    mongo: {
        url: DB,
        db_name: DB_NAME
    },
    server: {
        port: SERVER_PORT,
        host: HOST
    }
};
