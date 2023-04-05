"use strict";
/**************************************
@File    :   index.ts
@Time    :   2023/01/31 10:32:48
@Author  :   路拾遗
@Version :   3.0.2
@Contact :   lk920125@hotmail.com
yarn add axios @rematch/loading @rematch/core  react-redux redux typescript @tarojs/taro
***************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./dva"), exports);
// export * from './file'
__exportStar(require("./request"), exports);
