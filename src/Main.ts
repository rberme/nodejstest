import { GameServer } from './Server';

const server = new GameServer(8081);

// 优雅退出
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...' + Date.now());
    await server.shutdown();
    process.exit(0);
});