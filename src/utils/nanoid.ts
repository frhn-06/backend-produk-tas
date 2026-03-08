import {customAlphabet} from 'nanoid';

const toId = () => {
    const nano =  customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return nano(6);
}

export {toId};