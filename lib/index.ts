/**************************************
@File    :   index.ts
@Time    :   2023/01/31 10:32:48
@Author  :   路拾遗
@Version :   1.0
@Contact :   lk920125@hotmail.com
yarn add axios @rematch/loading @rematch/core  react-redux redux typescript @tarojs/taro
***************************************/

import { useSelector } from "react-redux";
import { init, createModel } from "@rematch/core";
import loadingPlugin from "@rematch/loading";
import Taro from "@tarojs/taro";

// 默认枚举
export enum EFunctionKey {
    RSetState = "RSetState",
    EGet = "EGet",
    EGetOne = "EGetOne",
    EPost = "EPost",
    EPostBatch = "EPostBatch",
    EDelete = "EDelete",
    EPut = "EPut",
    EPutBatch = "EPutBatch",
}

// dva参数
const dvaParams: { storeInstance: any, printLog: boolean, token: string } = { storeInstance: null, printLog: false, token: "TaroToken" };
// 所有的model
const modelArray: any[] = [];

export function bindingModel(model: any) {
    modelArray.push(model);
}

export const initModels = (printLog = false, token = "TaroToken") => {
    if (dvaParams.storeInstance) return dvaParams.storeInstance
    console.log("modelArray size ==>", modelArray.length)
    dvaParams.printLog = printLog;
    dvaParams.token = token;
    const models: any = {};
    for (let model of modelArray) {
        models[model.namespace] = createModel()({
            ...model,
            effects: (dispatch) => {
                let newEffects: any = {};
                let namespace = model.namespace;
                for (let key in model.effects) {
                    newEffects[key] = async (payload: any, rootState: any) => {
                        return await model.effects[key](
                            { state: rootState[namespace], payload },
                            {
                                reducer: (...args: any) => {
                                    if (args.length <= 2) {
                                        args.unshift(namespace);
                                    }
                                    dvaParams.printLog &&
                                        console.log("[reducer]", args[0], args[1], args[2]);
                                    dispatch[args[0]][args[1]](args[2]);
                                },
                                select: (namespace2: string) => rootState[namespace2],
                                effect: async (...args: any) => {
                                    if (args.length <= 2) {
                                        args.unshift(namespace);
                                    }
                                    dvaParams.printLog &&
                                        console.log("[effect]", args[0], args[1], args[2]);
                                    return await dispatch[args[0]][args[1]](args[2]);
                                },
                            }
                        );
                    };
                }
                return newEffects;
            },
        });
    }
    dvaParams.storeInstance = init({
        models,
        plugins: [loadingPlugin({ type: "full" })],
    });
    return dvaParams.storeInstance;
};

export const useLoading = (namespace: string) => {
    return useSelector((store: any) => {
        return store.loading.models[namespace];
    });
};
export const useConnect = (namespace: string) => {
    return useSelector((store: any) => {
        return store[namespace];
    });
};
export const reducer = (namespace: string, type: string, payload: any) => {
    dvaParams.printLog && console.log("[reducer]", namespace, type, payload);
    return dvaParams.storeInstance.dispatch[namespace][type](payload);
};
export const effect = async (
    namespace: string,
    type: string,
    payload?: any
): Promise<any> => {
    dvaParams.printLog && console.log("[effect]", namespace, type, payload);
    return await dvaParams.storeInstance.dispatch[namespace][type](payload);
};

/*------------------------- 基于axios实现的通用request，json格式，jwt校验 -------------------------*/
const requestParams: any = {
    serverHome: null,
    errorHanlder: null,
    printLog: false,
    extraHeaders: {},
    serverHomeIndex: 0,
};
export function initRequest(
    serverHome: string[],
    errorHanlder: Function,
    printLog = false,
    serverHomeIndex = 0,
) {
    requestParams.printLog = printLog;
    requestParams.serverHome = serverHome;
    requestParams.errorHanlder = errorHanlder;
    requestParams.serverHomeIndex = serverHomeIndex;
}
export function bindHeader(key: string, value: string) {
    requestParams.extraHeaders[key] = value;
}
export function bindJWTToken(token?: string) {
    if (token) {
        Taro.setStorageSync(dvaParams.token, token);
        requestParams.extraHeaders["Authorization"] = token;
    } else {
        Taro.removeStorageSync(dvaParams.token);
        delete requestParams.extraHeaders["Authorization"];
    }
}
export function requestGet(url: string, body?: any,): any {
    return request(url, { method: "GET", body }, null);
}
export function requestDelete(url: string) {
    return request(url, { method: "DELETE" }, null);
}
export function requestPost(url: string, body?: any,): any {
    return request(url, { method: "POST", body }, null);
}
export function requestPatch(url: string, body?: any,) {
    return request(url, { method: "PATCH", body }, null);
}
export function requestPut(url: string, body?: any,) {
    body && delete body.id;
    return request(url, { method: "PUT", body }, null);
}
// export function requestFile(url: string, file: File, serverHomeIndex: number = 0) {
//     let body = new FormData()
//     body.append('file', file)
//     return request(url, { method: 'POST', body }, 'application/form-data', serverHomeIndex)
// }

function request(
    url: string,
    options: any,
    ContentType: any = null,
): Promise<any> {
    return new Promise((resolve, reject) => {
        const { method, body } = options;
        // 添加url前缀
        if (url.indexOf("https://") === -1 && url.indexOf("http://") === -1) {
            url =
                requestParams.serverHome[requestParams.serverHomeIndex] +
                (url.indexOf("/") === 0 ? url.substr(1) : url);
            if (!requestParams.extraHeaders["Authorization"]) {
                const token = Taro.getStorageSync(dvaParams.token);
                token && (requestParams.extraHeaders["Authorization"] = token);
            }
        }
        const option: any = {
            method,
            url,
            header: {
                Accept: "application/json",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                Expires: 0,
                "Content-Type": ContentType || "application/json; charset=utf-8",
                ...requestParams.extraHeaders,
            },
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

        Taro.request(option).then((response: any) => {
            const { data, statusCode } = response;
            requestParams.printLog &&
                console.log("[request]", method, url, body, data);
            if (statusCode >= 400) {
                requestParams.errorHanlder(data?.message?.toString(), statusCode);
                if (401 == statusCode) {
                    bindJWTToken();
                }
                resolve(null);
            } else {
                resolve(data);
            }
        });
    });
}
