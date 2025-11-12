
import React from 'react';
import type { Asset, PriceHistory } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './icons';

interface TickerProps {
  items: Asset[];
  priceHistory: PriceHistory;
}

const TickerItem: React.FC<{ item: Asset; initialPrice: number | null }> = ({ item, initialPrice }) => {
  const currentPrice = item.regularMarketPrice;
  
  if (currentPrice === null || initialPrice === null) {
    return null;
  }
  
  const change = currentPrice - initialPrice;
  const changePercent = initialPrice === 0 ? 0 : (change / initialPrice) * 100;
  
  const isUp = change > 0;
  const isDown = change < 0;
  
  const colorClass = isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4">
      <span className="font-semibold text-white">{item.symbol.replace('-USD', '')}</span>
      <span className={`font-mono tabular-nums ${colorClass}`}>{currentPrice.toFixed(2)}</span>
      <div className={`flex items-center font-mono tabular-nums text-sm ${colorClass}`}>
        {isUp && <TrendingUpIcon className="w-4 h-4" />}
        {isDown && <TrendingDownIcon className="w-4 h-4" />}
        <span>{changePercent.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const Ticker: React.FC<TickerProps> = ({ items, priceHistory }) => {
  if (items.length === 0) {
    return (
        <div className="w-full bg-gray-900 border-y border-gray-800 overflow-hidden h-10 flex items-center">
            <span className="text-gray-600 px-4 text-sm">Awaiting market data for ticker...</span>
        </div>
    );
  }
  
  const tickerItems = items.map((item) => (
    <TickerItem key={item.symbol} item={item} initialPrice={priceHistory[item.symbol]?.initial || null} />
  ));

  return (
    <div className="w-full bg-gray-900 border-y border-gray-800 overflow-hidden">
      <div className="flex py-2 animate-scroll">
        <div className="flex space-x-8">{tickerItems}</div>
        <div className="flex space-x-8" aria-hidden="true">{tickerItems}</div>
      </div>
    </div>
  );
};

export default Ticker;
