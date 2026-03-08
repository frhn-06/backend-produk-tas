import {customAlphabet} from 'nanoid';

const toId = () => {
    const nano =  customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    return nano();
}

export {toId};