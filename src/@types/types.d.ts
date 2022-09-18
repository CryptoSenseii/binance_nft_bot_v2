export declare interface Config {
    uuid: string
    csrf: string
}

export declare interface Proxy {
    host: string,
    port: number,
    auth?: {
        username: string,
        password: string
    },
    protocol: 'http'
}
