"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = exports.MsgID = exports.UserInfoField = exports.PaymentEvent = void 0;
var PaymentEvent;
(function (PaymentEvent) {
    PaymentEvent["Success"] = "minis.trade_order.redeem.success";
    PaymentEvent["RefundSuccess"] = "minis.trade_order.redeem.refund_success";
    PaymentEvent["RefundFail"] = "minis.trade_order.redeem.refund_fail";
    PaymentEvent["RefundTraceback"] = "minis.trade_order.redeem.refund_traceback";
})(PaymentEvent || (exports.PaymentEvent = PaymentEvent = {}));
var UserInfoField;
(function (UserInfoField) {
    UserInfoField["OpenID"] = "open_id";
    UserInfoField["AvatarURL"] = "avatar_url";
    UserInfoField["AvatarURL100"] = "avatar_url_100";
    UserInfoField["AvatarLargeURL"] = "avatar_large_url";
    UserInfoField["DisplayName"] = "display_name";
    UserInfoField["UserName"] = "username";
})(UserInfoField || (exports.UserInfoField = UserInfoField = {}));
var MsgID;
(function (MsgID) {
    MsgID[MsgID["CreateOrder"] = 90001] = "CreateOrder";
    MsgID[MsgID["DeleteOrder"] = 90002] = "DeleteOrder";
    MsgID[MsgID["CheckComplete"] = 90003] = "CheckComplete";
    MsgID[MsgID["PayComplete"] = 90004] = "PayComplete";
})(MsgID || (exports.MsgID = MsgID = {}));
exports.Products = [
    { productName: "50 Diamonds", amount: 1 },
    { productName: "110 Diamonds", amount: 2 },
    { productName: "250 Diamonds", amount: 4 },
    { productName: "450 Diamonds", amount: 6 },
    { productName: "1100 Diamonds", amount: 12 },
    // { productName: "600 Diamonds", amount: 60 },
];
//# sourceMappingURL=types.js.map