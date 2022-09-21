import axios, { AxiosInstance } from 'axios';
import logger from './logger';
import UserAgent from 'user-agents';
import fs from 'fs';
import { inputSetConfig, inputProxyPath } from "./inputs";
import { Config, Proxy, Product } from "./typings/types";
import { Chance } from 'chance';
import { lastProduct } from './typings/requests';

export default class Sniper {
    private config!: Config
    private proxies!: Proxy[]
    private threads!: number

    constructor(
        public useProxy: boolean
    ) { }

    async setConfig() {
        const isCfgExists = fs.existsSync('config.json');
        if (!isCfgExists) {
            this.config = await inputSetConfig();
            await this.saveConfigToFile();
        } else if (Object.keys(JSON.parse(fs.readFileSync('config.json', 'utf-8'))).length === 0) {
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

    setThreads() {
        if (!this.proxies || this.proxies.length <= 1) {
            this.threads = 1;
        } else if (this.proxies.length > 25) {
            this.threads = 25;
        } else {
            this.threads = this.proxies.length;
        }
    }

    async getLastProductId(): Promise<number> {
        let axiosClient: AxiosInstance;

        if (this.useProxy) {
            axiosClient = axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'User-Agent': new UserAgent().toString()
                },
                proxy: new Chance().pickone(this.proxies)
            });
        } else {
            axiosClient = axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'User-Agent': new UserAgent().toString()
                }
            });
        }

        return await axiosClient.post('https://www.binance.com/bapi/nft/v1/friendly/nft/asset/market/asset-list', )
            .then(({ data }) => data.data.rows[0].productId)
            .catch(err => {
               throw Error(err);
            });
    }

    async getProductData(proxy: Proxy, productId: number): Promise<any> {
        let axiosClient: AxiosInstance;

        if (this.useProxy) {
            axiosClient = axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'User-Agent': new UserAgent().toString()
                },
                proxy: new Chance().pickone(this.proxies)
            });
        } else {
            axiosClient = axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'User-Agent': new UserAgent().toString()
                }
            });
        }

        return await axiosClient.post('https://www.binance.com/bapi/nft/v1/friendly/nft/nft-trade/product-detail', {
            productId: productId
        })
            .then(({ data }) => data.data.productDetail)
            .catch(() => false);
    }

    analyzeProduct(productData: Product) {
        
        console.log('Analyzing...', productData.productNo, productData.id);
    }

    async main() {
        let workingThreads: number = 0;
        let counter: number = 0;
        let productId: number = await this.getLastProductId();
        let errorTracker: boolean[] = [];

        while (true) {
            if (workingThreads < this.threads) {
                workingThreads++;

                if (counter === this.proxies.length) {
                    counter = 0;
                }

                if (errorTracker.filter(e => e === false).length >= errorTracker.length * 0.8 && errorTracker.length > 3) {
                    productId = await this.getLastProductId();
                }
                this.getProductData(this.proxies[counter % this.proxies.length], productId)
                    .then(async (productData) => {
                        workingThreads--;
                        if (errorTracker.length === 5 * this.threads) {
                            errorTracker.splice(0, 1);
                        }
                        productData === false ? errorTracker.push(false) : errorTracker.push(true);
                        if (productData !== false) {
                            this.analyzeProduct(productData);
                        }
                    });
                productId++;
                counter++;
            } else {
                await new Promise(r => setTimeout(r, 25));
            }
        }
    }

    async start() {
       try {
            await this.setConfig();

            if (this.useProxy) {
                await this.setProxy();
            } else {
                this.proxies = [];
            }

            this.setThreads();

            logger.success(`Live Sniper launched successfully in ${this.threads} threads.`, { time: true });

            await this.main();

        } catch (err: any) {
           logger.error(err, { time: true });
       }
    }
}
