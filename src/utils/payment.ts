import axios from "axios";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";


export interface Payment {
    transaction_details: {
        order_id: string;
        gress_amount: number;
    }
}


export type TyperesponseMidtrans = {
    token: string;
    redirect_url: string;
}


const payment = {
    async createLink(payload: Payment) :Promise<TyperesponseMidtrans> {
        const result = await axios.post<TyperesponseMidtrans>(`${MIDTRANS_TRANSACTION_URL}`, payload, {
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json",
                Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`
            }
        })

        if(result.status !== 201) {
            throw new Error("payment failed")
        }

        return result?.data;
    } 
}

export default payment;