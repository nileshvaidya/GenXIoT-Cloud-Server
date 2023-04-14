"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.DB_NAME = exports.FRONTEND_URL = exports.JWT_KEY = exports.PORT = exports.DB = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB = process.env.DB;
exports.PORT = process.env.PORT;
exports.JWT_KEY = process.env.JWT_KEY;
exports.FRONTEND_URL = process.env.FRONTEND_URL;
exports.DB_NAME = process.env.DB_NAME;
var SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
var HOST = process.env.HOST;
exports.config = {
    mongo: {
        url: exports.DB,
        db_name: exports.DB_NAME
    },
    server: {
        port: SERVER_PORT,
        host: HOST
    }
};
