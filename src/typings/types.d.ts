export declare interface Config {
    uuid: string
    csrf: string,
    buyOptions?: [
        {
            collectionId: number,
            name?: string,
            itemId?: number,
            rarity?: number,
            maxPrice: number,
            currencies?: string[],
            listTypes?: number[],
            verified?: number,
            contract?: string,
        }
    ]
}

export declare interface Proxy {
    host: string,
    port: number,
    auth?: {
        username: string,
        password: string
    },
    protocol: string
}

export declare interface Product {
    id: number,
    productNo: string,
    title: string,
    category: number,
    relateId: string,
    nftType: number,
    tradeType: number,
    amount: string,
    maxAmount: string,
    stepAmount: string,
    currentAmount: string,
    currency: 'BUSD' | 'BNB' | 'ETH',
    setStartTime: number,
    setEndTime: number,
    status: number,
    batchNum: number,
    stockNum: number,
    leftStockNum: number,
    coverUrl: string,
    description: string,
    creatorId: string | number | null,
    listerId: string | number | null,
    listTime: number,
    listType: number,
    source: number,
    categoryVo: {
        code: number,
        name: string
    },
    mediaType: string | null,
    tokenList: [
        {
            nftId: number,
            tokenId: string,
            contractAddress: string,
            listBefore: string | number | null,
            network: string,
            protocol: string | null
        }
    ],
    store: null,
    collection: {
        collectionName: string,
        avatarUrl: string | null,
        canView: boolean,
        collectionId: string | number,
        verified: number
    },
    createTime: number,
    remarkType: string | null
}
