import crypto from 'crypto';

import { SECRET } from './env';

const encrypt = (password: string) => {
    return crypto.pbkdf2Sync(password, SECRET, 100, 64, 'sha512').toString('hex');
}

export {encrypt}