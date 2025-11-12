
export interface Asset {
  symbol: string;
  regularMarketPrice: number | null;
  type: 'stock' | 'crypto';
}

export interface Stock {
  symbol:string;
  regularMarketPrice: number | null;
}

export interface Crypto {
  symbol: string;
  regularMarketPrice: number | null;
}

export interface MarketData {
  stocks: Stock[];
  cryptos: Crypto[];
}

export interface PriceHistory {
  [symbol: string]: {
    initial: number | null;
    history: { price: number }[];
  };
}