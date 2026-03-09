import { AccessTokenData } from "./types";



export class Player {
    // public openID: string;

    public orderState: number = -1;//0没有, 1创建了，2已支付
    public orderID: string;
    // public productName: string;
    public productIdx: number;

    public tradeOrderID: string;


    public accessToken: AccessTokenData;


    public Update(_deltaTime: number) {

        if (this.accessToken != null) {
            this.accessToken.expires_in -= _deltaTime;
            this.accessToken.refresh_expires_in -= _deltaTime;

            if (this.accessToken.refresh_expires_in - 10 <= 0) {
                this.accessToken = null;
            }
        }
    }
}


export class PlayerPool {
    private static _inst: PlayerPool;
    public static get Inst(): PlayerPool {
        if (PlayerPool._inst == null) {
            let self = new PlayerPool();

            PlayerPool._inst = self;
        }
        return PlayerPool._inst;
    }


    private buf: Player[];
    private constructor() {
        this.buf = [];

    }


    public Pop(): Player {
        let retval: Player = this.buf.pop();
        if (retval == null) {
            retval = new Player();
        }
        return retval;
    }

    public Push(_data: Player) {
        this.buf.push(_data);
    }
}

