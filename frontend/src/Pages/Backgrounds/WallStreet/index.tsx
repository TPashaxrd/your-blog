
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { io, Socket } from 'socket.io-client';

interface Asset {
  symbol: string;
  regularMarketPrice: number | null;
  type: 'stock' | 'crypto';
}

interface Stock {
  symbol: string;
  regularMarketPrice: number | null;
}

interface Crypto {
  symbol: string;
  regularMarketPrice: number | null;
}

interface MarketData {
  stocks: Stock[];
  cryptos: Crypto[];
}

interface PriceHistory {
  [symbol:string]: {
    initial: number | null;
    history: { price: number }[];
  };
}

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);

const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>
);

const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /></svg>
);

const CandlestickChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 15v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/><path d="M17 13v6"/></svg>
);

const BitcoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11.8 19.2c-2 .8-4.2.4-5.6-1.2-1.8-2-1.5-5.1.6-6.9 1.1-.9 2.5-1.4 3.9-1.4.3 0 .6 0 .9.1.5.1 1 .2 1.5.4 1.1.4 2.2 1.1 2.8 2.2.5 1 .5 2.2 0 3.2-1.2 2.4-4.2 3.5-6.1 3.6Z"/><path d="M15 6.8c.8-.8 1.9-1.3 3-1.3 2.1 0 3.8 1.7 3.8 3.8 0 1.4-.8 2.7-1.9 3.4"/><path d="M15 17.2c.8.8 1.9 1.3 3 1.3 2.1 0 3.8-1.7 3.8-3.8 0-1.4-.8-2.7-1.9-3.4"/><path d="M5 10.5v.9c0 1.2 1 2.1 2.1 2.1h.5"/><path d="M5 14.8v-.9c0-1.2 1-2.1 2.1-2.1h.5"/><path d="M12.5 6.5V2"/><path d="M12.5 22v-4.5"/><path d="M12.5 12.5h-1c-1 0-1.8-.8-1.8-1.8v-.4c0-1 .8-1.8 1.8-1.8h1"/><path d="M12.5 12.5h-1c-1 0-1.8.8-1.8-1.8v.4c0 1 .8 1.8 1.8 1.8h1"/></svg>
);

const SOCKET_URL = `http://localhost:5000`;
const MAX_HISTORY_LENGTH = 30;

function useMarketData(stocks: string[], crypto: string[]) {
  const [marketData, setMarketData] = useState<MarketData>({ stocks: [], cryptos: [] });
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current?.emit('subscribeMarket', { stocks, crypto });
    });
    socketRef.current.on('disconnect', () => setIsConnected(false));
    socketRef.current.on('marketData', (data: MarketData) => {
      setPriceHistory(prev => {
        const newHistory = { ...prev };
        [...data.stocks, ...data.cryptos].forEach(item => {
          if (!item.regularMarketPrice) return;
          if (!newHistory[item.symbol]) {
            newHistory[item.symbol] = { initial: item.regularMarketPrice, history: [{ price: item.regularMarketPrice }] };
          } else {
             const updatedHistory = [...newHistory[item.symbol].history, { price: item.regularMarketPrice }];
             newHistory[item.symbol].history = updatedHistory.slice(-MAX_HISTORY_LENGTH);
          }
        });
        return newHistory;
      });
      setMarketData(data);
    });
    socketRef.current.on('marketError', (err: any) => console.error('Market Error:', err));
    return () => { socketRef.current?.disconnect(); };
  }, [stocks, crypto]);

  return { marketData, priceHistory, isConnected };
}

const { AreaChart, Area, YAxis, ResponsiveContainer } = (window as any).Recharts || {};

const AssetCard: React.FC<{ asset: Asset; historyData?: PriceHistory[string]; animationDelay: number }> = ({ asset, historyData, animationDelay }) => {
  const [flash, setFlash] = useState<'up' | 'down' | 'none'>('none');
  const prevPriceRef = useRef<number | null>(asset.regularMarketPrice);

  const { symbol, regularMarketPrice, type } = asset;
  const initialPrice = historyData?.initial;

  useEffect(() => {
    if (regularMarketPrice !== null && prevPriceRef.current !== null) {
      if (regularMarketPrice > prevPriceRef.current) setFlash('up');
      else if (regularMarketPrice < prevPriceRef.current) setFlash('down');
    }
    const timer = setTimeout(() => setFlash('none'), 600);
    prevPriceRef.current = regularMarketPrice;
    return () => clearTimeout(timer);
  }, [regularMarketPrice]);

  const change = (initialPrice != null && regularMarketPrice != null) ? regularMarketPrice - initialPrice : 0;
  const changePercent = (initialPrice && regularMarketPrice != null) ? (change / initialPrice) * 100 : 0;
  const isUp = change > 0, isDown = change < 0;
  
  const theme = {
    textColor: isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-[var(--color-neutral)]',
    borderColor: isUp ? 'border-green-500/30' : isDown ? 'border-red-500/30' : 'border-[var(--color-border)]',
    hover: 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_var(--color-glow-alt)]',
    chartColor: isUp ? "var(--color-up-glow)" : isDown ? "var(--color-down-glow)" : "var(--color-neutral)",
    chartGradient: isUp ? "url(#priceUp)" : isDown ? "url(#priceDown)" : "url(#priceNeutral)",
    Icon: isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : MinusIcon,
  };
  
  const formattedPrice = regularMarketPrice?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: regularMarketPrice && regularMarketPrice > 10 ? 2 : 5
  }) ?? '---.--';

  return (
    <div className={`bg-black/40 rounded-lg border p-4 transition-all duration-300 ease-out animate-fadeInUp backdrop-blur-sm ${theme.borderColor} ${theme.hover} ${flash !== 'none' ? `border-flash ${flash}` : ''}`} style={{ animationDelay: `${animationDelay}ms`}}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold font-orbitron text-gray-100">{symbol.replace('-USD', '')}</h3>
          <p className="text-xs text-cyan-400 uppercase tracking-widest font-mono">{type}</p>
        </div>
        <theme.Icon className={`w-6 h-6 ${theme.textColor}`} />
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className={`text-3xl font-mono tabular-nums text-white price-flash ${flash}`}>
            ${formattedPrice}
          </div>
          <div className={`flex items-center text-sm font-semibold font-mono tabular-nums ${theme.textColor}`}>
            <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}</span>
            <span className="ml-2">({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="h-14 w-28 -mb-1 -mr-2">
          {ResponsiveContainer && <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData?.history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
               <defs>
                  <linearGradient id="priceUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="priceDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0}/>
                  </linearGradient>
                   <linearGradient id="priceNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
              <YAxis domain={['dataMin', 'dataMax']} hide={true} />
              <Area type="monotone" dataKey="price" stroke={theme.chartColor} strokeWidth={2.5} fillOpacity={1} fill={theme.chartGradient} isAnimationActive={false}/>
            </AreaChart>
          </ResponsiveContainer>}
        </div>
      </div>
    </div>
  );
};

const Ticker: React.FC<{ items: Asset[]; priceHistory: PriceHistory }> = ({ items }) => {
  const tickerItems = items.map(item => {
    if (item.regularMarketPrice === null) return null;
    return (
      <div key={item.symbol} className="flex-shrink-0 flex items-baseline gap-3 px-6">
        <span className="font-semibold text-gray-300 font-mono">{item.symbol.replace('-USD', '')}</span>
        <span className="font-mono tabular-nums text-lg text-white">{item.regularMarketPrice.toFixed(2)}</span>
      </div>
    );
  }).filter(Boolean);

  if (items.length === 0) return <div className="w-full bg-black/50 border-y border-[var(--color-border)] h-12 flex items-center"><span className="text-gray-600 px-4 text-sm animate-pulse font-mono">Awaiting market data stream...</span></div>;

  return (
    <div className="w-full bg-black/30 border-y-2 border-[var(--color-border)] overflow-hidden backdrop-blur-sm">
      <div className="flex py-2.5 animate-scroll">
        <div className="flex divide-x-2 divide-[var(--color-border)]">{tickerItems}</div>
        <div className="flex divide-x-2 divide-[var(--color-border)]" aria-hidden="true">{tickerItems}</div>
      </div>
    </div>
  );
};

const Header: React.FC<{ isConnected: boolean }> = ({ isConnected }) => (
  <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b-2 border-[var(--color-border)]">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-200 font-orbitron tracking-widest" style={{ textShadow: '0 0 10px var(--color-glow)'}}>
          MARKET TERMINAL
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <div className={`absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400 animate-ping' : 'bg-red-400'} opacity-75`}></div>
            <div className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <span className={`text-sm font-bold tracking-widest font-mono ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'LIVE FEED' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  </header>
);

const MarketLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center h-96 text-[var(--color-glow-alt)]">
    <pre className="text-xl md:text-2xl font-mono" style={{ textShadow: '0 0 8px var(--color-glow-alt)'}}>
{`
  ███╗   ███╗ █████╗ ██╗  ██╗██╗  ██╗
  ████╗ ████║██╔══██╗██║ ██╔╝██║  ██║
  ██╔████╔██║███████║█████╔╝ ███████║
  ██║╚██╔╝██║██╔══██║██╔═██╗ ██╔══██║
  ██║ ╚═╝ ██║██║  ██║██║  ██╗██║  ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
`}
    </pre>
    <h2 className="text-2xl font-semibold font-orbitron mt-4">CONNECTING TO MARKET FEED<span className="blink">...</span></h2>
    <p className="text-cyan-800 mt-2 font-mono">INITIALIZING REAL-TIME DATA STREAM.</p>
  </div>
);

const STOCKS_TO_WATCH = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'NFLX'];
const CRYPTO_TO_WATCH = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'SOL-USD', 'ADA-USD'];

function MarketPage() {
  const { marketData, priceHistory, isConnected } = useMarketData(STOCKS_TO_WATCH, CRYPTO_TO_WATCH);

  return (
    <main className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      <Ticker items={[
        ...marketData.stocks.map(s => ({...s, type: 'stock' as const})),
        ...marketData.cryptos.map(c => ({...c, type: 'crypto' as const}))
      ]} priceHistory={priceHistory} />
      
      <div className="flex-grow max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {marketData.stocks.length === 0 && marketData.cryptos.length === 0 ? (
          <MarketLoader />
        ) : (
          <>
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <CandlestickChartIcon className="w-8 h-8 text-[var(--color-glow)]" style={{ filter: 'drop-shadow(0 0 5px var(--color-glow))'}}/>
                <h2 className="text-4xl font-black font-orbitron tracking-wider text-gray-100">[ STOCKS ]</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {marketData.stocks.map((stock, index) => (
                  <AssetCard key={stock.symbol} asset={{...stock, type: 'stock'}} historyData={priceHistory[stock.symbol]} animationDelay={index * 60} />
                ))}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-4 mb-6">
                <BitcoinIcon className="w-8 h-8 text-amber-400" style={{ filter: 'drop-shadow(0 0 5px #fbbF24)'}}/>
                <h2 className="text-4xl font-black font-orbitron tracking-wider text-gray-100">[ CRYPTOCURRENCY ]</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {marketData.cryptos.map((crypto, index) => (
                  <AssetCard key={crypto.symbol} asset={{...crypto, type: 'crypto'}} historyData={priceHistory[crypto.symbol]} animationDelay={index * 60} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <footer className="text-center py-4 text-xs text-cyan-900/80 border-t border-[var(--color-border)] font-mono">
        SYSTEM ONLINE [STATUS: OPERATIONAL] | Data is simulated for demonstration purposes only.
      </footer>
    </main>
  );
}

function App() {
  return (
    <div className="min-h-screen main-background">
      <div className="crt-effect">
        <MarketPage />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);