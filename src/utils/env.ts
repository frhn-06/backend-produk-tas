import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL : string = process.env.DATABASE_URL || "";
const SECRET : string = process.env.SECRET || "";

const EMAIL_PASSWORD_APP : string = process.env.EMAIL_PASSWORD_APP || "";
const MY_EMAIL : string = process.env.MY_EMAIL || "";

const CLIENT_HOST : string = process.env.CLIENT_HOST || "";

const CLOUD_NAME: string = process.env.CLOUD_NAME || "";
const API_KEY : string = process.env.API_KEY || "";
const API_SECRET : string = process.env.API_SECRET || "";
const API_ENVIRONMENT_VARIABLE : string = process.env.API_ENVIRONMENT_VARIABLE || ""


export {DATABASE_URL, SECRET, EMAIL_PASSWORD_APP, MY_EMAIL, CLIENT_HOST, CLOUD_NAME, API_KEY, API_SECRET, API_ENVIRONMENT_VARIABLE}