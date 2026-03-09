"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
// src/RedisManager.ts
const ioredis_1 = __importDefault(require("ioredis"));
class RedisManager {
    static instance;
    client;
    constructor() {
        // this.client = new Redis({
        //     host: '127.0.0.1',//process.env.REDIS_HOST || '127.0.0.1',
        //     port: 6379,//Number(process.env.REDIS_PORT) || 6379,
        //     password: 'redis-Asdf#1236', //process.env.REDIS_PASSWORD || undefined,
        //     db: 9,
        // });
        this.client = new ioredis_1.default("redis://default:058ada25cf4e498cb1988f7ada551a31@fly-tictactoeserver-redis.upstash.io:6379");
        this.client.on('error', (err) => {
            console.error('Redis 连接错误:', err);
        });
        this.client.on('connect', () => {
            console.log('Redis 连接成功');
        });
    }
    static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }
    getClient() {
        return this.client;
    }
    // 便捷方法
    async getPlayerData(playerId) {
        const data = await this.client.get(`player:${playerId}`);
        return data ? JSON.parse(data) : null;
    }
    async savePlayerData(playerId, data) {
        await this.client.set(`player:${playerId}`, JSON.stringify(data), 'EX', 60 * 60 * 24 * 30); // 30天过期
    }
    async deletePlayerData(playerId) {
        await this.client.del(`player:${playerId}`);
    }
}
exports.RedisManager = RedisManager;
//# sourceMappingURL=RedisManager.js.map