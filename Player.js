"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPool = exports.Player = void 0;
class Player {
    // public openID: string;
    orderState = -1; //0没有, 1创建了，2已支付
    orderID;
    // public productName: string;
    productIdx;
    tradeOrderID;
    accessToken;
    Update(_deltaTime) {
        if (this.accessToken != null) {
            this.accessToken.expires_in -= _deltaTime;
            this.accessToken.refresh_expires_in -= _deltaTime;
            if (this.accessToken.refresh_expires_in - 10 <= 0) {
                this.accessToken = null;
            }
        }
    }
}
exports.Player = Player;
class PlayerPool {
    static _inst;
    static get Inst() {
        if (PlayerPool._inst == null) {
            let self = new PlayerPool();
            PlayerPool._inst = self;
        }
        return PlayerPool._inst;
    }
    buf;
    constructor() {
        this.buf = [];
    }
    Pop() {
        let retval = this.buf.pop();
        if (retval == null) {
            retval = new Player();
        }
        return retval;
    }
    Push(_data) {
        this.buf.push(_data);
    }
}
exports.PlayerPool = PlayerPool;
//# sourceMappingURL=Player.js.map