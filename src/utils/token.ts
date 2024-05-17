import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { UserToken } from '../database/models/Users'

dotenv.config()

export const generateAccessToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { algorithm: 'HS512', expiresIn: '12h' })

    return generate
}

export const generateRefreshToken = (data: UserToken): string => {
    const jwtsk: string = process.env.SECRET_REFRESH_TOKEN as string
    const generate: string = jwt.sign(data, jwtsk, { algorithm: 'HS512', expiresIn: '24h' })

    return generate
}

export const verifyAccessToken = (token: string): UserToken | null => {
    const jwtsk: string = process.env.SECRET_ACCESS_TOKEN as string

    let verify: UserToken | null | undefined

    jwt.verify(token, jwtsk, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined): void => {
        if (error) {
            verify = null
        }
        verify = decoded as UserToken | undefined
    })

    return verify ?? null
}

export const verifyRefreshToken = (token: string): UserToken | null => {
    const jwtsk: string = process.env.SECRET_REFRESH_TOKEN as string

    let verify: UserToken | null | undefined

    jwt.verify(token, jwtsk, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined): void => {
        if (error) {
            verify = null
        }
        verify = decoded as UserToken | undefined
    })

    return verify ?? null
}
