import mongoose from 'mongoose';

import { DATABASE_URL } from './env';


const connect = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "db-toko"
        });

        console.log(`Active db name : ${mongoose.connection.name}`);

        return Promise.resolve("database connected |");

    } catch(error) {
        return Promise.reject(error);
    }
}


export default connect;