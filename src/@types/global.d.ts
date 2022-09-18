type Config = {
    uuid: string
    csrf: string
}

type Proxy = {
    host: string,
    port: number,
    auth?: {
        username: string,
        password: string
    },
    protocol: 'http'
}
