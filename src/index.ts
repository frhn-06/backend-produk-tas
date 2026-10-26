// import express from "express";
// import router from './routes/api'
// import connect from "./utils/database";
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import { Request, Response } from "express";
// import docs from "./docs/route";
// import errorMiddleware from "./middleware/error.middleware";

// async function init() {
//     try {
//         const result = await connect();
//         console.log(`database status : ${result}`);

//         const app = express();

//         const port = 3000;

//         app.use(cors());

//         app.use(bodyParser.json());


//         app.get('/', (req:Request, res:Response) => {
//             res.status(200).json({
//                 meta: {
//                     status: 200,
//                     message: "home page app"
//                 },
//                 data: "aplikasi official velaro"
//             })
//         });


//         app.use('/api', router)

//         docs(app);

//         app.use(errorMiddleware.severRoute());
        
//         app.use(errorMiddleware.serverError());

//         app.listen(port, () => console.log(`server is running on http://localhost:${port}`));

//     } catch(error) {
//         console.log(error);
//     }
// }

// init()





import express, { Request, Response } from "express";
import router from "./routes/api";
import connect from "./utils/database";
import bodyParser from "body-parser";
import cors from "cors";
import docs from "./docs/route";
import errorMiddleware from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        meta: {
            status: 200,
            message: "home page app"
        },
        data: "aplikasi official velaro"
    });
});

app.use("/api", router);

docs(app);

app.use(errorMiddleware.severRoute());
app.use(errorMiddleware.serverError());

// Simpan Promise koneksi agar tidak membuat koneksi
// database baru setiap kali handler dipanggil.
let dbConnection: Promise<unknown> | null = null;

async function ensureDatabase() {
    if (!dbConnection) {
        dbConnection = connect().catch((error) => {
            dbConnection = null;
            throw error;
        });
    }

    await dbConnection;
}

// Entry point untuk Vercel
export default async function handler(
    req: Request,
    res: Response
) {
    try {
        await ensureDatabase();
        return app(req, res);
    } catch (error) {
        console.error("Database connection error:", error);

        return res.status(500).json({
            meta: {
                status: 500,
                message: "Internal server error"
            }
        });
    }
}

// Jalankan server hanya ketika development lokal
if (process.env.NODE_ENV !== "production") {
    ensureDatabase()
        .then(() => {
            app.listen(3000, () => {
                console.log("Server berjalan di port 3000");
            });
        })
        .catch((error) => {
            console.error("Gagal menjalankan server:", error);
        });
}