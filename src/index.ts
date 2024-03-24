import authRouter from '@route/auth.router'
import userRouter from '@route/user.router'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import corsOptions from '@config/cors.config'

const app = express()

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/auth', authRouter)

app.listen(3000, () => {
    console.log(`server running @ http://localhost:3000/`)
})
