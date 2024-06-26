import SECRET_CONFIG from '@config/secret.config'
import { verify } from '@controller/jsonwebtoken.controller'
import { TokenUser } from '@model/user.model'
import { NextFunction, Request, Response } from 'express'

export default function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const cookies = req.cookies

    if (!cookies || typeof cookies !== 'object' || Object.keys(cookies).length === 0)
        return res.status(400).json({ error: 'cookies must be included in the request!' })

    const token = cookies[SECRET_CONFIG.authTokenName]
    if (!token) return res.status(400).json({ error: 'req.cookie.token is missing!' })

    try {
        const verified = verify(token)
        if (typeof verified !== 'object') return res.status(403).json({ error: 'invalid token', detail: 'missing data in token' })

        req.user = verified as TokenUser
        req.token = token
        next()
    } catch (err) {
        res.status(403).json({ error: 'invalid token!' })
    }
}

export interface AuthenticatedRequest extends Request {
    user?: TokenUser
    token?: string
}
