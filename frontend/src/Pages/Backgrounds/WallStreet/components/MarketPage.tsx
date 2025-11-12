import { useMarketData } from '../hooks/useMarketData';
import type { Asset } from '../types';
import Header from './Header';
import Ticker from './Ticker';
import AssetCard from './AssetCard';
import { CandlestickChartIcon, BitcoinIcon } from './icons';

const STOCKS_TO_WATCH = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'NFLX'];
const CRYPTO_TO_WATCH = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'SOL-USD', 'ADA-USD'];

export default function MarketPage() {
  const { marketData, priceHistory, isConnected } = useMarketData(STOCKS_TO_WATCH, CRYPTO_TO_WATCH);

  const allAssets: Asset[] = [
    ...marketData.stocks.map(s => ({ ...s, type: 'stock' as const })),
    ...marketData.cryptos.map(c => ({ ...c, type: 'crypto' as const }))
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      <Ticker items={allAssets} priceHistory={priceHistory} />
      
      <div className="flex-grow max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {marketData.stocks.length === 0 && marketData.cryptos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-96">
             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-300">Connecting to Market Feed...</h2>
            <p className="text-gray-500 mt-2">Waiting for live data. Please ensure the backend server is running.</p>
          </div>
        ) : (
          <>
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6 border-l-4 border-cyan-400 pl-4">
                <CandlestickChartIcon className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl font-bold tracking-tighter text-white">Stocks</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {marketData.stocks.map((stock) => (
                  <AssetCard 
                    key={stock.symbol}
                    asset={{...stock, type: 'stock'}} 
                    historyData={priceHistory[stock.symbol]}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-l-4 border-amber-400 pl-4">
                 <BitcoinIcon className="w-8 h-8 text-amber-400" />
                <h2 className="text-3xl font-bold tracking-tighter text-white">Cryptocurrency</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {marketData.cryptos.map((crypto) => (
                  <AssetCard 
                    key={crypto.symbol}
                    asset={{...crypto, type: 'crypto'}} 
                    historyData={priceHistory[crypto.symbol]}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
       <footer className="text-center py-4 text-xs text-gray-600 border-t border-gray-800">
        Wall Street Market Terminal | Data is simulated and for demonstration purposes only.
      </footer>
    </main>
  );
}
