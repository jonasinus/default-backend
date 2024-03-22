import { generateID } from '@security/random'
import jwt, { JwtPayload } from 'jsonwebtoken'

const secret = process.env.secret || generateID([])

export function verify(token: string): string | JwtPayload {
    return jwt.verify(token, secret)
}

export function token(payload: Object): string {
    return jwt.sign(payload, secret)
}
