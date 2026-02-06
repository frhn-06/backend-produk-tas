import express from "express";
import router from './routes/api'
import connect from "./utils/database";
import bodyParser from 'body-parser';
import cors from 'cors';
import { Request, Response } from "express";
import docs from "./docs/route";
import errorMiddleware from "./middleware/error.middleware";

async function init() {
    try {
        const result = await connect();
        console.log(`database status : ${result}`);

        const app = express();

        const port = 3000;

        app.use(cors());

        app.use(bodyParser.json());


        app.get('/', (req:Request, res:Response) => {
            res.status(200).json({
                meta: {
                    status: 200,
                    message: "home page app"
                },
                data: "aplikasi official velaro"
            })
        });


        app.use('/api', router)

        docs(app);

        app.use(errorMiddleware.severRoute());
        
        app.use(errorMiddleware.serverError());

        app.listen(port, () => console.log(`server is running on http://localhost:${port}`));

    } catch(error) {
        console.log(error);
    }
}

init()