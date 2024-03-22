import database from '@database/database'
import { User } from '@model/user.model'
import { securePassword } from '@security/hashing'

export async function createUser({ username, password }: { username: string; password: string }): Promise<User> {
    const secPw = securePassword(password)
    const user = database.insertUser({ username, password_hash: secPw.hash, password_salt: secPw.salt })
    return user
}

export async function findUser(by: 'id' | 'username', key: string) {
    let user: User | null = null
    if (by === 'id') user = await database.getUserById(key)
    else if (by === 'username') user = await database.getUserByName(key)
    if (!user || Object.keys(user).length === 0) throw new Error('no such user exists')
    return user
}
