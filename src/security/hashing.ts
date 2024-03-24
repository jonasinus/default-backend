import SECRET_CONFIG from '@config/secret.config'
import { genSaltSync, hashSync } from 'bcrypt'

export function securePassword(password: string): { hash: string; salt: string } {
    const salt = genSaltSync(SECRET_CONFIG.saltRounds)
    const hash = hashSync(password, salt)
    return { hash, salt }
}

export function comparePassword(salt: string, hash: string, password: string): boolean {
    const hash2 = hashSync(password, salt)
    return hash2 === hash
}
