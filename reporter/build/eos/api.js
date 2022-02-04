"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = void 0;
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const util_1 = require("util");
const networks_1 = require("./networks");

exports.getApi = (() => {
    const apis = {};
    return (networkName) => {
        if (!apis[networkName]) {
            
            if (!process.env.WATCH_NET)
                throw new Error(`Environment variables not loaded for: ${process.env.WATCH_NET}`);
            
            //Ok let's do it that way then ...
            const val = process.env.TELOS_IBC;
            if(!val) return;
            
            const [acc, permission, key] = val.split.val.split(`;`).map((x) => x.trim());
            
            const signatureProvider = new eosjs_jssig_1.JsSignatureProvider([
                key
            ].filter(Boolean));
            apis[networkName] = new eosjs_1.Api({
                rpc: networks_1.getRpc(networkName),
                signatureProvider,
                textDecoder: new util_1.TextDecoder(),
                textEncoder: new util_1.TextEncoder(),
            });
        }
        return apis[networkName];
    };
})();
//# sourceMappingURL=api.js.map
