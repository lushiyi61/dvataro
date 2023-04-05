export declare function initRequest(serverHome: string[], errorHandler: Function, printLog?: boolean, serverHomeIndex?: number, token?: string): void;
export declare function bindHeader(key: string, value: string): void;
export declare function getUrl(url?: string, index?: number): string;
export declare function requestGet(url: string, body?: any, serverHomeIndex?: number): Promise<any>;
export declare function requestDelete(url: string, serverHomeIndex?: number): Promise<any>;
export declare function requestPost(url: string, body?: any, serverHomeIndex?: number): Promise<any>;
export declare function requestPatch(url: string, body?: any, serverHomeIndex?: number): Promise<any>;
export declare function requestPut(url: string, body?: any, serverHomeIndex?: number): Promise<any>;
export declare function bindJWTToken(token?: string): void;
