

// src/RedisManager.ts
import Redis from 'ioredis';

export class RedisManager {
    private static instance: RedisManager;
    private client: Redis;

    private constructor() {
        // this.client = new Redis({
        //     host: '127.0.0.1',//process.env.REDIS_HOST || '127.0.0.1',
        //     port: 6379,//Number(process.env.REDIS_PORT) || 6379,
        //     password: 'redis-Asdf#1236', //process.env.REDIS_PASSWORD || undefined,
        //     db: 9,
        // });
        this.client = new Redis("redis://default:058ada25cf4e498cb1988f7ada551a31@fly-tictactoeserver-redis.upstash.io:6379");

        this.client.on('error', (err) => {
            console.error('Redis 连接错误:', err);
        });

        this.client.on('connect', () => {
            console.log('Redis 连接成功');
        });
    }

    static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    getClient(): Redis {
        return this.client;
    }

    // 便捷方法
    async getPlayerData(playerId: string): Promise<any> {
        const data = await this.client.get(`player:${playerId}`);
        return data ? JSON.parse(data) : null;
    }

    async savePlayerData(playerId: string, data: any): Promise<void> {
        await this.client.set(`player:${playerId}`, JSON.stringify(data), 'EX', 60 * 60 * 24 * 30); // 30天过期
    }

    async deletePlayerData(playerId: string): Promise<void> {
        await this.client.del(`player:${playerId}`);
    }
}