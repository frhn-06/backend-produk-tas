import nodemailer from 'nodemailer'
import { EMAIL_PASSWORD_APP, MY_EMAIL } from '../env';

import ejs from 'ejs';

import path from 'path';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MY_EMAIL,
    pass: EMAIL_PASSWORD_APP
  },
});

interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const renderHtml = async (templates: string, data: any): Promise<string> => {
    const content = await ejs.renderFile(path.join(__dirname, 'content/' + templates), data);
    return content as string;
}


const sendMail = async ({from, to, subject, html } : ISendMail) => {
    const result = await transporter.sendMail({from, to, subject, html});
    return result
}



export {renderHtml, sendMail}

export default transporter;
