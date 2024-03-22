import authRouter from '@route/auth.router'
import userRouter from '@route/user.router'
import cookieParser from 'cookie-parser'
import express from 'express'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/auth', authRouter)

app.listen(3000, () => {
    console.log(`server running @ http://localhost:3000/`)
})
