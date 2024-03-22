export type User = {
    id: string
    username: string
    password_hash: string
    password_salt: string
}

export type TokenUser = {
    id: string
    username: string
}
