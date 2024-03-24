import mysql, { createPool } from 'mysql'
import { User } from '../models/user.model'
import { generateID } from '@security/random'
import { resolve } from 'path'
import DB_CONF from '@/config/database.config'

function Database() {
    const pool = createPool({ ...DB_CONF.credentials })

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

    async function setupDB() {
        pool.query(
            `
        -- Create the users table
        CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(32) PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255) -- You might want to store a hashed password here
        );
        
        -- Create the planners table
        CREATE TABLE IF NOT EXISTS planners (
            planner_id VARCHAR(32) PRIMARY KEY,
            planner_name VARCHAR(255),
            user_id VARCHAR(32),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        
        -- Create the appointments table
        CREATE TABLE IF NOT EXISTS appointments (
            appointment_id VARCHAR(32) PRIMARY KEY,
            appointment_datetime DATETIME,
            description TEXT,
            planner_id VARCHAR(32),
            FOREIGN KEY (planner_id) REFERENCES planners(planner_id)
        );
        
        -- Create the permissions_granted table
        CREATE TABLE IF NOT EXISTS permissions_granted (
            permission_id VARCHAR(32) PRIMARY KEY,
            granting_user_id VARCHAR(32),
            target_user_id VARCHAR(32),
            permission_type ENUM('planner', 'appointment'),
            item_id VARCHAR(32),
            can_edit BOOLEAN DEFAULT FALSE,
            can_view BOOLEAN DEFAULT FALSE,
            can_add BOOLEAN DEFAULT FALSE,
            can_admin BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (granting_user_id) REFERENCES users(user_id),
            FOREIGN KEY (target_user_id) REFERENCES users(user_id),
            CONSTRAINT fk_planner_id FOREIGN KEY (item_id) REFERENCES planners(planner_id) ON DELETE CASCADE,
            CONSTRAINT fk_appointment_id FOREIGN KEY (item_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE
        );
        `,
            (err, result) => {
                if (err) {
                    console.error('Error setting up database:', err)
                } else {
                    console.log('Database setup successful.')
                }
            }
        )
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
