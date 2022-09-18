import axios, { AxiosInstance } from 'axios'
import UserAgent  from 'user-agents'
import input from 'input'
import { logger } from './logger'
import chalk from 'chalk'
import { inputStart, inputSetConfig } from './inputs'
import { createReadStream } from 'fs'


(async() => {
    console.log(chalk.greenBright('Welcome to BinanceNFT BOT v2'));
    const mode: number = inputStart()
    switch (mode) {
        case 0: {
            return chalk.redBright('Bot stopped.')
        }
        case 1: 
    }
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

// const calcProfit = (a, b, fee) => ( a / b ) - 1 - fee