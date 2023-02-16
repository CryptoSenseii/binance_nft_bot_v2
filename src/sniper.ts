import axios, { AxiosInstance } from 'axios';
import logger from './logger';
import UserAgent from 'user-agents';
import fs from 'fs';
import { inputUseProxy, inputSetConfig, inputProxyPath } from "./inputs";
import { Chance } from 'chance';
import { Config, Proxy, Product } from "./typings/types";
import { lastProduct } from './typings/requests';

export default class Sniper {
    private config!: Config
    private proxies!: Proxy[]
    private threads!: number
    private useProxy!: boolean
    private currencyRates!: {
        BUSD?: number,
        BNB?: number,
        ETH?: number
    }

    async setConfig() {
        try {
            const isCfgExists = fs.existsSync('config.json');
            if (!isCfgExists) {
                throw Error();
            } else if (Object.keys(JSON.parse(fs.readFileSync('config.json', 'utf-8'))).length === 0) {
                this.config = await inputSetConfig();
            }
        } catch {
            this.config = await inputSetConfig();
            await this.saveConfigToFile();
        } finally {
            this.config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
        }
    }

    async saveConfigToFile() {
        fs.writeFileSync('config.json', JSON.stringify(this.config, null, 4));
    }

    setAxiosClient(proxy?: Proxy) {
        if (this.useProxy) {
            return axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'user-agent': new UserAgent().toString()
                },
                proxy: proxy || new Chance().pickone(this.proxies)
            });
        } else {
            return axios.create({
                headers: {
                    'bnc-uuid': this.config.uuid,
                    'csrftoken': this.config.csrf,
                    'user-agent': new UserAgent().toString()
                }
            });
        }
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

    async setCurrencyRates(currencies: string[]) {
        const axiosClient = this.setAxiosClient();
        const result = {}

        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i] !== 'BUSD') {
                const rate = await axiosClient.get(`https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=${currencies[i]}USDT`)
                    .then(({ data }) => Number(data.data.c));

                Object.defineProperty(result, currencies[i], {
                    value: rate,
                    enumerable: true
                });
            } else if (currencies[i] == 'BUSD') {
                Object.defineProperty(result, currencies[i], {
                    value: 1,
                    enumerable: true
                });
            }
        }
        this.currencyRates = result;
    }

    async getLastProductId(): Promise<number> {
        const axiosClient = this.setAxiosClient();
        return await axiosClient.post('https://www.binance.com/bapi/nft/v1/friendly/nft/asset/market/asset-list', lastProduct)
            .then(({ data }) => data.data.rows[0].productId)
            .catch(err => {
                throw Error(err);
            });
    }

    async getProductData(proxy: Proxy, productId: number): Promise<any> {
        const axiosClient = this.setAxiosClient(proxy);
        return await axiosClient.post('https://www.binance.com/bapi/nft/v1/friendly/nft/nft-trade/product-detail', {
            productId: productId
        })
            .then(({ data }) => data.data.productDetail)
            .catch(() => false);
    }

    analyzeProduct(productData: Product): boolean {
        let result = true;
        let price: number =  Number(productData.amount) * Number(this.currencyRates[productData.currency]);
        this.config.buyOptions?.forEach(e => {
            let filterResult = [];
            if (e.collectionId) {
                filterResult.push(e.collectionId == productData.collection.collectionId ? true : false);
            }
            if (e.maxPrice) {
                filterResult.push(55 <= e.maxPrice  ? true : false);
            }

            filterResult.includes(false) ? result = false : result = true
        });

        if (result === true) {
            logger.info(`Gotcha! ${productData.collection.collectionId} ${productData.title} ${productData.amount} ${productData.tokenList[0].nftId}`);
        }
        return result;
    }

    async buy(proxy: Proxy, productData: Product) {
        const axiosClient = this.setAxiosClient(proxy);
        const nftId = productData.tokenList[0].nftId;
        console.log('Buying...', nftId)
    }

    async main() {
        let workingThreads: number = 0;
        let counter: number = 0;
        let productId: number = await this.getLastProductId();
        let errorTracker: boolean[] = [];

        setInterval(() => logger.info('Still running...', { time: true }), 60000);
        setInterval(async () => await this.setCurrencyRates(['BNB', 'ETH']), 300000);
        
        await this.setCurrencyRates(['BUSD', 'BNB', 'ETH']);

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
                            const matches = this.analyzeProduct(productData);
                            if (matches === true) {
                                await this.buy(this.proxies[counter % this.proxies.length], productData);
                            }
                        }
                    });
                productId++;
                counter++;
            } else {
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    async start() {
        try {
            this.useProxy = await inputUseProxy();
            await this.setConfig();
            this.useProxy === true ? await this.setProxy() : this.proxies = [];
            this.setThreads();
            this.main();

            logger.success(`Live Sniper launched successfully in ${this.threads} threads.`, { time: true });

        } catch (err: any) {
            logger.error(err, { time: true });
        }
    }
}
