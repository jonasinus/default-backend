import { createUser, findUser } from '@controller/user.controller'
import database from '@database/database'
import { Router } from 'express'

const userRouter = Router()

userRouter.post('/create', (req, res) => {
    const { username, password } = req.body
    if (!username || username.trim() === '') return res.status(400).json({ error: 'req.body.name is null' })
    if (!password || password.trim() === '') return res.status(400).json({ error: 'req.body.password is null' })

    createUser({ username, password })
        .then((user) => {
            res.status(201).json({ msg: 'user created!', user: { id: user.id, username: user.username } })
        })
        .catch((err) => {
            res.status(500).json({ error: 'could not create user!', err })
        })
})

userRouter.get('/name/:name', async (req, res) => {
    const name = req.params.name
    if (!name || name.trim() === '') return res.status(404).json({ error: 'no name provided!' })
    try {
        const user = await findUser('username', name)
        res.status(200).json({ msg: 'user found!', user: user })
    } catch (err) {
        res.status(404).json({ error: 'user not found!', err })
    }
})

userRouter.get('/id/:id', async (req, res) => {
    const id = req.params.id
    if (!id || id.trim() === '') return res.status(404).json({ error: 'no id provided!' })
    try {
        const user = findUser('id', id)
        res.status(200).json({ msg: 'user found!', user: user })
    } catch (err) {
        res.status(404).json({ error: 'no such user found!', err })
    }
})

userRouter.delete('/:name', (req, res) => {
    const id = req.params.name
    if (!id || id.trim() === '') return res.status(400).json({ error: 'no req.param.id provided' })

    try {
        const result = database.query('DELETE FROM users WHERE username = ?', [id])
        res.status(200).json({ msg: 'user deleted!' })
    } catch (err) {
        res.status(404).json({ error: 'no such user exists', err })
    }
})

export default userRouter
