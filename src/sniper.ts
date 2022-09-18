import axios, {AxiosInstance} from 'axios';
import logger from './logger';
import UserAgent from 'user-agents';
import fs from 'fs';
import {inputSetConfig, inputProxyPath} from "./inputs";
import path from 'path';
import {Config, Proxy} from "./@types/types";

export default class Sniper {
    private config!: Config
    private proxies!: Proxy[]

    constructor(
        public useProxy: boolean
    ) {}

    async setConfig() {
        const cfgFile = fs.readFileSync(path.join('config.json'), 'utf-8');

        if (!cfgFile) {
            this.config = await inputSetConfig();
            await this.saveConfigToFile();
        } else if (Object.keys(JSON.parse(cfgFile)).length === 0) {
            this.config = await inputSetConfig();
            await this.saveConfigToFile();
        }
        this.config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
    }

    async saveConfigToFile() {
        fs.writeFileSync('config.json', JSON.stringify(this.config));
    }

    async setProxy() {
        const proxies: Proxy[] = [];
        const proxyPath: string = await inputProxyPath();
        const proxyStrings = fs.readFileSync(proxyPath, 'utf-8')
            .trim()
            .split(/[\r\n]+/);

        proxyStrings.forEach(proxyString => {
            let proxySplitted: string[] = proxyString.split(':');
            if (proxySplitted.length > 2) {
                const proxy: Proxy = {
                    host: proxySplitted[0],
                    port: Number(proxySplitted[1]),
                    auth: {
                        username: proxySplitted[2],
                        password: proxySplitted[3]
                    },
                    protocol: 'http'
                }

                proxies.push(proxy);
            } else if (proxySplitted.length === 2) {
                const proxy: Proxy = {
                    host: proxySplitted[0],
                    port: Number(proxySplitted[1]),
                    protocol: 'http'
                }

                proxies.push(proxy);
            } else {
                throw Error(`Invalid proxy! ${proxyString}`);
            }
        });
        this.proxies = proxies;
    }

    async start() {
        try {
            await this.setConfig();
            if (this.useProxy) {
                await this.setProxy();
            }
            logger.success('Live Sniper launched successfully.', {time: true});
            
            
        } catch (err: any) {
            logger.error(err, {time: true});
        }
    }
}