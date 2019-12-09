// https://dev.twitch.tv/docs/api
import fetch from 'node-fetch';
import { Request, RequestInfo, RequestInit } from 'node-fetch';
// import { SECRETS } from '../secrets';

export class HelixApi {
    baseUrl: string = 'https://api.twitch.tv/helix';
    constructor() { }

    getMostActiveStreamsForGameId(gameId: number) {
        return get(`${this.baseUrl}/streams?game_id=${gameId}`);
    }
}

interface IHttpResponse<T> extends Response {
    parseBody?: T;
}

const clientId = '';

export const get = async <T>(path: string, args: RequestInit = { method: 'get', headers: { 'Client-ID': clientId } }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

export const post = async <T>(path: string, body: any, args: RequestInit = { method: 'post', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

export const put = async <T>(path: string, body: any, args: RequestInit = { method: 'put', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}


const http = <T>(request: RequestInfo): Promise<IHttpResponse<T>> => {
    return new Promise((resolve, reject) => {
        let response: IHttpResponse<T>;
        fetch(request).then((res: any) => {
            response = res;
            return res.json();
        }).then((body: any) => {
            if (response.ok) {
                response.parseBody = body;
                resolve(response);
            } else {
                reject(response);
            }
        }).catch((error: any) => {
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
