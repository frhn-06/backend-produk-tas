import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL : string = process.env.DATABASE_URL || "";
const SECRET : string = process.env.SECRET || "";

const EMAIL_PASSWORD_APP : string = process.env.EMAIL_PASSWORD_APP || "";
const MY_EMAIL : string = process.env.MY_EMAIL || "";

const CLIENT_HOST : string = process.env.CLIENT_HOST || "";


export {DATABASE_URL, SECRET, EMAIL_PASSWORD_APP, MY_EMAIL, CLIENT_HOST}