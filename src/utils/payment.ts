import axios from "axios";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";


export interface Payment {
    transaction_details: {
        order_id: string;
        gross_amount: number;
    },
    callbacks: {
        finish: string;
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

        console.log("FINISH CALLBACK:", payload.callbacks?.finish);
        console.log("MIDTRANS REDIRECT:", result.data.redirect_url);

        if(result.status !== 201) {
            throw new Error("payment failed")
        }

        return result?.data;
    } 
}

export default payment;