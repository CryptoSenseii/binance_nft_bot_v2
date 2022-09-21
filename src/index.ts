import chalk from 'chalk';
import { inputSelectMode, inputUseProxy } from './inputs';
import Sniper from "./sniper";

(async () => {
    console.log(chalk.magentaBright('Welcome to BinanceNFT BOT v2'));

    const mode: number = await inputSelectMode();

    switch (mode) {
        case 0: {
            const sniper = new Sniper();
            await sniper.start();
            break;
        }

        case 1: {

            break;
        }

    }
})();
