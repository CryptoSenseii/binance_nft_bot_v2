import chalk from 'chalk';

interface Options {
    time: boolean
}

const logger = {
    info: (str: string, options?: Options) => {
        let result: string = '';
        if (options?.time === true) {
            result = `[${(new Date).toLocaleTimeString()}] `;
        }
        result += str;
        console.log(result);
    },
    success: (str: string, options?: Options) => {
        let result: string = '';
        if (options?.time === true) {
            result = `[${(new Date).toLocaleTimeString()}] `;
        }
        result += str;
        console.log(chalk.greenBright(result));
    },
    error: (str: string, options?: Options) => {
        let result: string = '';
        if (options?.time === true) {
            result = `[${(new Date).toLocaleTimeString()}] `;
        }
        result += str;
        console.log(chalk.redBright(result));
    }
}

export default logger;
