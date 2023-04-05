"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindJWTToken = exports.requestPut = exports.requestPatch = exports.requestPost = exports.requestDelete = exports.requestGet = exports.getUrl = exports.bindHeader = exports.initRequest = void 0;
const taro_1 = require("@tarojs/taro");
/*------------------------- 基于taro实现的通用request，json格式，jwt校验 -------------------------*/
const requestParams = {
    serverHome: [],
    errorHandler: () => { },
    printLog: false,
    extraHeaders: {},
    serverHomeIndex: 0,
    token: "Token",
};
function initRequest(serverHome, errorHandler, printLog = false, serverHomeIndex = 0, token = "Token") {
    requestParams.printLog = printLog;
    requestParams.serverHome = serverHome;
    requestParams.errorHandler = errorHandler;
    requestParams.serverHomeIndex = serverHomeIndex;
    requestParams.token = token;
}
exports.initRequest = initRequest;
function bindHeader(key, value) {
    requestParams.extraHeaders[key] = value;
}
exports.bindHeader = bindHeader;
function getUrl(url, index = -1) {
    if (!url) {
        return requestParams.serverHome[requestParams.serverHomeIndex];
    }
    // 添加url前缀
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        return requestParams.serverHome[index >= 0 ? index : requestParams.serverHomeIndex] + url;
    }
    return url;
}
exports.getUrl = getUrl;
function requestGet(url, body, serverHomeIndex) {
    return request(getUrl(url, serverHomeIndex), { method: "GET", body }, null);
}
exports.requestGet = requestGet;
function requestDelete(url, serverHomeIndex) {
    return request(getUrl(url, serverHomeIndex), { method: "DELETE" }, null);
}
exports.requestDelete = requestDelete;
function requestPost(url, body, serverHomeIndex) {
    return request(getUrl(url, serverHomeIndex), { method: "POST", body }, null);
}
exports.requestPost = requestPost;
function requestPatch(url, body, serverHomeIndex) {
    return request(getUrl(url, serverHomeIndex), { method: "PATCH", body }, null);
}
exports.requestPatch = requestPatch;
function requestPut(url, body, serverHomeIndex) {
    body && delete body.id;
    return request(getUrl(url, serverHomeIndex), { method: "PUT", body }, null);
}
exports.requestPut = requestPut;
function bindJWTToken(token) {
    if (token) {
        taro_1.default.setStorageSync(requestParams.token, token);
        requestParams.extraHeaders["Authorization"] = token;
    }
    else {
        taro_1.default.removeStorageSync(requestParams.token);
        delete requestParams.extraHeaders["Authorization"];
    }
}
exports.bindJWTToken = bindJWTToken;
function request(url, options, ContentType = null) {
    return new Promise((resolve, reject) => {
        const { method, body } = options;
        if (!requestParams.extraHeaders["Authorization"]) {
            const token = taro_1.default.getStorageSync(requestParams.token);
            token && (requestParams.extraHeaders["Authorization"] = token);
        }
        const option = {
            method,
            url,
            header: Object.assign({ Accept: "application/json", Pragma: "no-cache", "Cache-Control": "no-cache", Expires: 0, "Content-Type": ContentType || "application/json; charset=utf-8" }, requestParams.extraHeaders),
            dataType: "json",
        };
        // 参数赋值
        switch (method.toUpperCase()) {
            case "GET":
            case "DELETE":
                option.data = body || {};
                break;
            case "POST":
            case "PATCH":
            case "PUT":
                option.data = body || {};
                break;
        }
        taro_1.default.request(option).then((response) => {
            var _a;
            const { data, statusCode } = response;
            requestParams.printLog &&
                console.log("[request]", method, url, body, data);
            if (statusCode >= 400) {
                requestParams.errorHandler((_a = data === null || data === void 0 ? void 0 : data.message) === null || _a === void 0 ? void 0 : _a.toString(), statusCode);
                if (401 == statusCode) {
                    bindJWTToken();
                }
                resolve(null);
            }
            else {
                resolve(data);
            }
        });
    });
}
