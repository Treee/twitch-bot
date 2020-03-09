import express, { Router, Request, Response } from 'express';

export class TwitchPublisher {

    private router: Router;

    constructor() {
        this.router = express.Router({
            strict: true
        });
        this.initializeRoutes();
    }

    public startServer() {
        const app = express();
        app.use(express.json());
        app.use(this.router);
        app.listen(3001, () => {
            console.log('Publisher Server Started. Listening on Port 3001');
        });
    }


    private initializeRoutes() {
        this.router.get('/', (request: Request, response: Response) => {
            console.log('request', request);
            // response.send()
        });
        this.router.post('/', (request: Request, response: Response) => {
            console.log('request', request);
            // response.send()
        });
    }

}