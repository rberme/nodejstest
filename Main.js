"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
const server = new Server_1.GameServer(8081);
// 优雅退出
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...' + Date.now());
    await server.shutdown();
    process.exit(0);
});
//# sourceMappingURL=Main.js.map