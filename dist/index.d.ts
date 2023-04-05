/**************************************
@File    :   index.ts
@Time    :   2023/01/31 10:32:48
@Author  :   路拾遗
@Version :   3.0.2
@Contact :   lk920125@hotmail.com
yarn add @rematch/loading @rematch/core  react-redux redux typescript
***************************************/
export declare enum EFunctionKey {
    RSetState = "RSetState",
    EGet = "EGet",
    EGetOne = "EGetOne",
    EPost = "EPost",
    EPostBatch = "EPostBatch",
    EDelete = "EDelete",
    EPut = "EPut",
    EPutBatch = "EPutBatch"
}
export declare const reducers: {
    RSetState(state: any, payload: any): any;
};
export declare function bindingModel(model: any): void;
export declare const initModels: (printLog?: boolean, token?: string) => any;
export declare const useLoading: (namespace: string) => any;
export declare const useConnect: (namespace: string) => any;
export declare const reducer: (namespace: string, type: string, payload: any) => any;
export declare const effect: (namespace: string, type: string, payload?: any) => Promise<any>;
