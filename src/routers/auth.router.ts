import SECRET_CONFIG from '@config/secret.config'
import { token } from '@controller/jsonwebtoken.controller'
import { findUser } from '@controller/user.controller'
import protect, { AuthenticatedRequest } from '@middleware/protect.middleware'
import { comparePassword } from '@security/hashing'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || username.trim() === '') return res.status(400).json({ error: 'no req.body.username specified!' })
    if (!password || password.trim() === '') return res.status(400).json({ error: 'no req.body.password specified!' })

    try {
        const user = await findUser('username', username)
        const salt = user.password_salt
        if (comparePassword(salt, user.password_hash, password)) {
            const jwt = token({ id: user.id, username: user.username, iat: Date.now() })
            return res
                .status(200)
                .cookie(SECRET_CONFIG.authTokenName, jwt, { expires: new Date(new Date().setMonth(new Date().getMonth() + 1)) })
                .json({ msg: 'logged in!' })
        }
        return res.status(403).json({ error: 'invalid credentials!' })
    } catch (err) {
        res.status(404).json({ error: 'no user with username-password-combination found' })
    }
})

authRouter.all('/logout', protect, (req: AuthenticatedRequest, res) => {
    res.clearCookie(SECRET_CONFIG.authTokenName).status(200).json({ msg: 'logged out!' })
})

export default authRouter
