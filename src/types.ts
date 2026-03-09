
export type AccessTokenData = {
    open_id: string,
    scope: string,
    access_token: string,
    expires_in: number,
    refresh_expires_in: number,
    refresh_token: string,
    token_type: string;

    createTime: number;
}

export type ErrorData = {
    error: string,
    error_description: string,
    log_id: string,
}

export type TradeOrderID = {
    data: {
        trade_order_id: string;
    },
    error: {
        code: string;
        message: string;
        log_id: string;
    }
}

export type PaymentCompletion = {
    client_key: string,
    event: PaymentEvent,
    create_time: number,
    user_openid: string,
    content: string,
}

export enum PaymentEvent {
    Success = "minis.trade_order.redeem.success",
    RefundSuccess = "minis.trade_order.redeem.refund_success",
    RefundFail = "minis.trade_order.redeem.refund_fail",
    RefundTraceback = "minis.trade_order.redeem.refund_traceback",
}

export enum UserInfoField {
    OpenID = "open_id",
    AvatarURL = "avatar_url",
    AvatarURL100 = "avatar_url_100",
    AvatarLargeURL = "avatar_large_url",
    DisplayName = "display_name",
    UserName = "username",
}



export enum MsgID {
    CreateOrder = 90001,
    DeleteOrder,
    CheckComplete,


    PayComplete,
}

export const Products = [
    { productName: "50 Diamonds", amount: 1 },
    { productName: "110 Diamonds", amount: 2 },
    { productName: "250 Diamonds", amount: 4 },
    { productName: "450 Diamonds", amount: 6 },
    { productName: "1100 Diamonds", amount: 12 },
    // { productName: "600 Diamonds", amount: 60 },
]