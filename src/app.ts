import axios, { AxiosInstance } from 'axios'
import logger from './logger'
import UserAgent from 'user-agents'
import { createReadStream } from 'fs'
import readlineSync from 'readline-sync'







// const axiosClient = axios.create({
//     proxy: {
//        host: host,
//        port: port,
//        auth: {
//           username: username,
//           password: password
//        },
//        protocol: 'http'
//     }
// })