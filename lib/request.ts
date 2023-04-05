import Taro from "@tarojs/taro";

/*------------------------- 基于Taro实现的通用request，json格式，jwt校验 -------------------------*/
const requestParams: {
    serverHome: string[],
    errorHandler: Function,
    printLog: boolean,
    extraHeaders: any,
    serverHomeIndex: number,
    token: string,
} = {
    serverHome: [],
    errorHandler: () => { },
    printLog: false,
    extraHeaders: {},
    serverHomeIndex: 0,
    token: "Token",
};
export function initRequest(
    serverHome: string[],
    errorHandler: Function,
    printLog = false,
    serverHomeIndex = 0,
    token = "Token",
) {
    requestParams.printLog = printLog;
    requestParams.serverHome = serverHome;
    requestParams.errorHandler = errorHandler;
    requestParams.serverHomeIndex = serverHomeIndex;
    requestParams.token = token;
}
export function bindHeader(key: string, value: string) {
    requestParams.extraHeaders[key] = value;
}

export function requestGet(url: string, body?: any, serverHomeIndex?: number): any {
    return request(getUrl(url, serverHomeIndex), { method: "GET", body }, null);
}
export function requestDelete(url: string, serverHomeIndex?: number) {
    return request(getUrl(url, serverHomeIndex), { method: "DELETE" }, null);
}
export function requestPost(url: string, body?: any, serverHomeIndex?: number): any {
    return request(getUrl(url, serverHomeIndex), { method: "POST", body }, null);
}
export function requestPatch(url: string, body?: any, serverHomeIndex?: number) {
    return request(getUrl(url, serverHomeIndex), { method: "PATCH", body }, null);
}
export function requestPut(url: string, body?: any, serverHomeIndex?: number) {
    body && delete body.id;
    return request(getUrl(url, serverHomeIndex), { method: "PUT", body }, null);
}

export function bindJWTToken(token?: string) {
    if (token) {
        Taro.setStorageSync(requestParams.token, token);
        requestParams.extraHeaders["Authorization"] = token;
    } else {
        Taro.removeStorageSync(requestParams.token);
        delete requestParams.extraHeaders["Authorization"];
    }
}

function getUrl(url?: string, index: number = -1): string {
    if (!url) {
        return requestParams.serverHome[requestParams.serverHomeIndex]
    }
    // 添加url前缀
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        return requestParams.serverHome[index >= 0 ? index : requestParams.serverHomeIndex] + url;
    }
    return url
}

function request(
    url: string,
    options: any,
    ContentType: any = null,
): Promise<any> {
    return new Promise((resolve, reject) => {
        const { method, body } = options;

        if (!requestParams.extraHeaders["Authorization"]) {
            const token = Taro.getStorageSync(requestParams.token);
            token && (requestParams.extraHeaders["Authorization"] = token);
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
                requestParams.errorHandler(data?.message?.toString(), statusCode);
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
