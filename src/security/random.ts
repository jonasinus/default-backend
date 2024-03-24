import SECRET_CONFIG from '@config/secret.config'

export function generateID(takenIds: string[] = []): string {
    const base64Chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    const idLength: number = SECRET_CONFIG.idLength
    let newId: string = ''

    do {
        for (let i = 0; i < idLength; i++) {
            const randomIndex: number = Math.floor(Math.random() * base64Chars.length)
            newId += base64Chars.charAt(randomIndex)
        }
    } while (takenIds.includes(newId))

    return newId
}
