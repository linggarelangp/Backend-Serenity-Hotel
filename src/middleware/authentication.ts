import { type Request, type Response, type NextFunction } from 'express'
import { UserToken } from '../database/models/Users'
import { verifyAccessToken } from '../utils/token'

export const authentication = (req: Request, res: Response, next: NextFunction): any => {
    const authorization: string | null = req.headers.authorization ?? null

    if (authorization === null) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const authString: string | null = authorization && authorization.split(' ')[1]

    if (authString === null) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const verify: UserToken | null = verifyAccessToken(authString)

    if (verify === null) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }

    next()
}