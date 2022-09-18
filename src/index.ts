import logger from './logger';
import chalk from 'chalk';
import {inputSelectMode, inputUseProxy} from './inputs';
import Sniper from "./sniper";

(async () => {
    console.log(chalk.magentaBright('Welcome to BinanceNFT BOT v2'));

    const mode: number = await inputSelectMode();

    switch (mode) {
        case 0: {
            const useProxy: boolean = await inputUseProxy();
            const sniper = new Sniper(useProxy);
            await sniper.start();
            break;
        }

        case 1: {

            break;
        }

    }
})();

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
