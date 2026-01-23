import {Request, Response} from 'express'

export default {
    dummy(req: Request, res: Response) {
        res.json({
            meta: {
                status: 200
            },
            data: "oke"
        })
    }
}