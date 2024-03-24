import { CorsOptions } from 'cors'

const corsOptions: CorsOptions = {
    credentials: true,
    origin(requestOrigin, callback) {
        if (true) callback(null, requestOrigin)
    }
}

export default corsOptions
