"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const types_1 = require("./types");
const Player_1 = require("./Player");
class GameServer {
    // private wss: WebSocketServer;
    players = new Map();
    constructor(port = 443) {
        // 读取证书
        let server = https_1.default.createServer({
            key: fs_1.default.readFileSync('private.key'), // 
            cert: fs_1.default.readFileSync('certificate.crt'), // 
            ca: fs_1.default.readFileSync('ca_bundle.crt') // 
        }, async (req, res) => {
            if (req.method === "POST") {
                let body = "";
                req.on("data", chunk => {
                    body += chunk;
                });
                req.on("end", async () => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    try {
                        let data = JSON.parse(body);
                        if (data.event != null) {
                            if (data.event == types_1.PaymentEvent.Success) {
                                let content = JSON.parse(data.content);
                                let orderId = content.order_id;
                                let tradeOrderId = content.trade_order_id;
                                // let openID = data.user_openid;
                                let player = this.players.get(data.user_openid);
                                if (player != null && player.orderState == 1 && player.tradeOrderID == tradeOrderId) {
                                    player.orderState = 2;
                                }
                            }
                        }
                        else {
                            let msgID = data.msgID;
                            switch (msgID) {
                                case types_1.MsgID.CreateOrder:
                                    {
                                        let openID = data.openID;
                                        let code = data.code;
                                        let player;
                                        // this.players.get(query.openID as string);
                                        if (openID == null || this.players.has(openID) == false) { //需要登录
                                            player = Player_1.PlayerPool.Inst.Pop();
                                            player.accessToken = await this.getAccessToken(code); //静默登录;
                                            this.players.set(openID, player);
                                        }
                                        else {
                                            player = this.players.get(openID);
                                            let now = Date.now();
                                            if (now > player.accessToken.createTime + player.accessToken.expires_in - 10) { //token过期了
                                                if (now > player.accessToken.createTime + player.accessToken.refresh_expires_in - 10) {
                                                    player.accessToken = await this.getAccessToken(code); //静默登录;
                                                }
                                                else {
                                                    player.accessToken = await this.refreshAccessToken(player.accessToken.refresh_token);
                                                }
                                            }
                                            //TODO:如果现在有订单怎么办
                                        }
                                        if (player.accessToken != null) {
                                            player.orderID = "order_" + player.accessToken.open_id + "_" + Date.now();
                                            player.productIdx = Number(data.productIdx);
                                            let product = types_1.Products[player.productIdx];
                                            let tradeOrderID = await this.createOrder(player.orderID, product.productName, product.amount);
                                            if (tradeOrderID != null) {
                                                if (tradeOrderID.error.code == "ok") {
                                                    player.tradeOrderID = tradeOrderID.data.trade_order_id;
                                                }
                                                else {
                                                    console.log(tradeOrderID.error.message);
                                                    player.tradeOrderID = null;
                                                }
                                            }
                                            else {
                                                player.tradeOrderID = null;
                                            }
                                        }
                                        else {
                                            player.tradeOrderID = null;
                                        }
                                        res.end(JSON.stringify({ tradeOrderID: player.tradeOrderID }));
                                    }
                                    break;
                                case types_1.MsgID.DeleteOrder:
                                    {
                                        let openID = data.openID;
                                        if (openID != null && this.players.has(openID) == true) {
                                            let player = this.players.get(openID);
                                            player.orderID = null;
                                            player.tradeOrderID = null;
                                            player.productIdx = -1;
                                        }
                                    }
                                    break;
                                case types_1.MsgID.CheckComplete:
                                    {
                                    }
                                    break;
                                case types_1.MsgID.PayComplete:
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                        res.end("");
                    }
                });
            }
            else {
                // 这里处理每个 HTTP 请求
                if (req.url === "/favicon.ico") {
                    res.writeHead(204); // No Content
                    res.end();
                    return;
                }
                // const query = url.parse(req.url || '', true).query;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("hello, world");
            }
        });
        server.listen(port, '::', () => {
            console.log('Server running on https://tictactoe.minigame.limited');
        });
        // port = process.env.PORT ? parseInt(process.env.PORT) : port;
        // let server = http.createServer((req, res) => {
        //     if (req.url === "/favicon.ico") {
        //         res.writeHead(204); // No Content
        //         res.end();
        //         return;
        //     }
        //     res.writeHead(200, { 'Content-Type': 'text/plain' });
        //     try {
        //         const query = url.parse(req.url || '', true).query;
        //         // console.log(query);
        //         let value = Number(query.value);
        //         // if (value == HttpMsg.RoomNum) {
        //         //     res.end(JSON.stringify({ value: this.rooms.size }));
        //         // } else if (value == HttpMsg.PlayerNum) {
        //         //     res.end(JSON.stringify({ value: this.onlinePlayers.size }));
        //         // } else {
        //         //     res.end("hello,world")
        //         // }
        //     } catch (e) {
        //         res.end("ok123");
        //     }
        //     // res.writeHead(200);
        //     // res.end('OK'); // 健康检查用
        // });
        // server.listen(port, () => {
        //     console.log(`Server running on http://[::]:${port}`);
        // });
        console.log(`游戏服务器已启动，端口: ${port}`);
    }
    Update(_deltaTime) {
        // for (let kv of this.rooms) {
        //     kv[1].Update(_deltaTime);
        // }
    }
    async SilentLogin(_code) {
    }
    async getUserInfo(_code, ...fields) {
        let fieldParam = "" + fields[0];
        for (let i = 1; i < fields.length; i++) {
            fieldParam += "," + fields[i];
        }
        let options = {
            hostname: "open.tiktokapis.com",
            path: "/v2/user/info/?fields=" + fieldParam,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.accessToken
            }
        };
        let result = await this.MyRequest(options);
        if (result != null && result.error == null) {
            return result.data;
        }
    }
    accessTokenTime = 0;
    accessToken;
    async getAccessToken(_code) {
        let data = JSON.stringify({
            client_key: "mgq69k6hqb0xoe8o", //Crossword
            client_secret: "niAMyHMEp7sSCSxZGZOfg6EZKqjXZLxW", //
            code: _code,
            grant_type: "authorization_code",
        });
        let options = {
            hostname: 'open.tiktokapis.com',
            path: '/v2/oauth/token/',
            method: 'POST',
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                // 'Content-Length': Buffer.byteLength(data)
            }
        };
        let result = await this.MyRequest(options, data);
        return result;
        // if (result == null) {
        //     return null;
        // } else if (result.error == null) {
        //     let player = this.players.get(result.open_id);
        //     if (player == null) {
        //         player = PlayerPool.Inst.Pop();
        //         this.players.set(result.open_id, player);
        //     }
        //     player.accessToken = result;
        //     player.accessToken.createTime = Date.now();
        //     return player;
        // }
    }
    async refreshAccessToken(_refreshToken) {
        let data = JSON.stringify({
            client_key: "mgq69k6hqb0xoe8o", //Crossword
            client_secret: "niAMyHMEp7sSCSxZGZOfg6EZKqjXZLxW", //
            refresh_token: _refreshToken,
            grant_type: "refresh_token",
        });
        let options = {
            hostname: 'open.tiktokapis.com',
            path: '/v2/oauth/token/',
            method: 'POST',
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                // 'Content-Length': Buffer.byteLength(data)
            }
        };
        let result = await this.MyRequest(options, data);
        return result;
        // if (result == null) {
        // } else if (result.error == null) {
        //     let player = this.players.get(result.open_id);
        //     if (player == null) {
        //     } else {
        //         player.accessToken = result;
        //         player.accessToken.createTime = Date.now();
        //     }
        // }
    }
    async createOrder(_orderID, _productName, _amount) {
        // console.log('GET access_token...');
        let data = JSON.stringify({
            token_type: "BEANS", // Required
            token_amount: _amount, // Required
            order_info: {
                order_id: _orderID, // Required
                product_name: _productName, // Required; displayed on the user's order list page
                // order_url: "/profile/order_history/external_product_id",
                // quantity: 1,
                // quantity_unit: "relive", // Pass the unit of the item being sold as appropriate; e.g., "episode" is the unit for a series
                // iamge_url: "https//your.domain/pics/wake_up_dad.jpg"
            }
        });
        let options = {
            hostname: 'open.tiktokapis.com',
            path: '/v2/minis/trade_order/create/',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                'Content-Length': Buffer.byteLength(data)
            }
        };
        let result = await this.MyRequest(options, data);
        return result;
    }
    async MyRequest(_options, _data = null) {
        return new Promise(resolve => {
            let req = https_1.default.request(_options, res => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    // console.log('响应:', body);
                    let json = JSON.parse(body);
                    resolve(json);
                });
            });
            req.on('error', err => {
                console.error('请求错误:', err);
                resolve(null);
            });
            if (_data != null) {
                req.write(_data);
            }
            req.end();
        });
    }
    // 优雅关闭
    async shutdown() {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待一段时间，确保所有玩家都已断开连接
        console.log('游戏服务器已关闭. ' + Date.now());
    }
}
exports.GameServer = GameServer;
//# sourceMappingURL=Server.js.map