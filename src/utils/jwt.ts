import jwt from 'jsonwebtoken'
import { IUserToken } from './interface'
import { SECRET } from './env'




const signIn = (user: IUserToken) => {
    const token = jwt.sign(user, SECRET,{
        expiresIn: '1h'
    })

    return token;
}

const getUserData = (token: string) => {
    const result = jwt.verify(token, SECRET) as IUserToken;
    return result;
}

export {signIn, getUserData}