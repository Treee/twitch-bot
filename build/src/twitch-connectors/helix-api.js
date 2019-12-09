"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://dev.twitch.tv/docs/api
const node_fetch_1 = __importDefault(require("node-fetch"));
const node_fetch_2 = require("node-fetch");
// import { SECRETS } from '../secrets';
class HelixApi {
    constructor() {
        this.baseUrl = 'https://api.twitch.tv/helix';
    }
    getMostActiveStreamsForGameId(gameId) {
        return exports.get(`${this.baseUrl}/streams?game_id=${gameId}`);
    }
}
exports.HelixApi = HelixApi;
const clientId = '';
exports.get = (path, args = { method: 'get', headers: { 'Client-ID': clientId } }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield http(new node_fetch_2.Request(path, args));
});
exports.post = (path, body, args = { method: 'post', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield http(new node_fetch_2.Request(path, args));
});
exports.put = (path, body, args = { method: 'put', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield http(new node_fetch_2.Request(path, args));
});
const http = (request) => {
    return new Promise((resolve, reject) => {
        let response;
        node_fetch_1.default(request).then((res) => {
            response = res;
            return res.json();
        }).then((body) => {
            if (response.ok) {
                response.parseBody = body;
                resolve(response);
            }
            else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};
// let response: IHttpResponse<ITodo[]>;
// try {
//     response = await http<ITodo[]>(
//         "https://jsonplaceholder.typicode.com/todosX"
//     );
//     console.log("response", response);
// } catch (response) {
//     console.log("Error", response);
// }
