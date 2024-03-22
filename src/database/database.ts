import mysql, { createPool } from 'mysql'
import { User } from '../models/user.model'
import { generateID } from '@security/random'
import { resolve } from 'path'

function Database() {
    const pool = createPool({ user: 'root', password: 'hallo', database: 'planner', port: 3306 })

    async function getUserIds(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT id FROM users', (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    const ids: string[] = results.map((row: any) => row.id)
                    resolve(ids)
                }
            })
        })
    }

    async function insertUser(user: Omit<User, 'id'>): Promise<User> {
        return new Promise(async (resolve, reject) => {
            let id = ''
            try {
                await getUserIds().then((ids) => (id = generateID(ids)))
            } catch (err) {
                reject({ msg: 'could not generate userId', err })
            }
            const obj = { id, username: user.username, password_hash: user.password_hash, password_salt: user.password_salt }
            pool.query('INSERT INTO users SET ?', obj, (err, res) => {
                if (err) reject({ msg: 'could not add user to database', err })
                else resolve({ ...user, id })
            })
        })
    }

    async function getUserById(id: string): Promise<any> {
        return new Promise((res, rej) => {
            pool.query('SELECT * FROM users WHERE id = ?', id, (err, result) => {
                if (err) rej({ msg: 'could not fetch user from database', err })
                else res({ ...result[0] })
            })
        })
    }

    async function getUserByName(name: string): Promise<any> {
        return new Promise((res, rej) => {
            pool.query('SELECT * FROM users WHERE username = ?', name, (err, result) => {
                if (err) rej({ msg: 'could not fetch user from database', err })
                else res({ ...result[0] })
            })
        })
    }

    async function query(query: string, values?: any[]) {
        return new Promise((res, rej) => {
            pool.query(query, values, (err, result) => {
                if (err) rej(err)
                else res(result)
            })
        })
    }

    return {
        pool,
        getUserIds,
        insertUser,
        getUserById,
        getUserByName,
        query
    }
}

const database = Database()

export default database
