// https://dev.twitch.tv/docs/api

export class HelixApi {
    constructor() { }
}

interface IHttpResponse<T> extends Response {
    parseBody?: T;
}

export const get = async <T>(path: string, args: RequestInit = { method: 'get', headers: { 'Client-ID': clientId } }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

export const post = async <T>(path: string, body: any, args: RequestInit = { method: 'post', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

export const put = async <T>(path: string, body: any, args: RequestInit = { method: 'put', headers: { 'Client-ID': clientId }, body: JSON.stringify(body) }): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

const clientId = 'gct24z0bpt832rurvqgn4m6kqja6kg';

const http = <T>(request: RequestInfo): Promise<IHttpResponse<T>> => {
    return new Promise((resolve, reject) => {
        let response: IHttpResponse<T>;
        fetch(request).then((res) => {
            response = res;
            return res.json();
        }).then((body) => {
            if (response.ok) {
                response.parseBody = body;
                resolve(response);
            } else {
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
