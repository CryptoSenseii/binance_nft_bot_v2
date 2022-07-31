import axios, { AxiosInstance } from 'axios'
import UserAgent  from 'user-agents'
import { logger } from './logger'
import chalk from 'chalk'
import { inputStart, inputSetConfig } from './inputs'
import { createReadStream } from 'fs'

(async() => {
    console.log(chalk.greenBright('Welcome to BinanceNFT BOT v2'));
    inputStart()
    
})()

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