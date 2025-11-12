
import React, { useState, useEffect, useRef } from 'react';
import type { Asset } from '../types';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from './icons';

import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

interface AssetCardProps {
  asset: Asset;
  historyData?: {
    initial: number | null;
    history: { price: number }[];
  };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, historyData }) => {
  const [flash, setFlash] = useState<'up' | 'down' | 'none'>('none');
  const prevPriceRef = useRef<number | null>(asset.regularMarketPrice);

  const { symbol, regularMarketPrice, type } = asset;
  const initialPrice = historyData?.initial;
  const priceSeries = historyData?.history || [];

  useEffect(() => {
    if (regularMarketPrice !== null && prevPriceRef.current !== null) {
      if (regularMarketPrice > prevPriceRef.current) {
        setFlash('up');
      } else if (regularMarketPrice < prevPriceRef.current) {
        setFlash('down');
      }
    }
    
    const timer = setTimeout(() => setFlash('none'), 400);
    prevPriceRef.current = regularMarketPrice;

    return () => clearTimeout(timer);
  }, [regularMarketPrice]);

  const change = (initialPrice !== null && initialPrice !== undefined && regularMarketPrice !== null) ? regularMarketPrice - initialPrice : 0;
  const changePercent = (initialPrice && regularMarketPrice !== null) ? (change / initialPrice) * 100 : 0;

  const isUp = change > 0;
  const isDown = change < 0;

  const flashColor = flash === 'up' ? 'bg-green-500/20' : flash === 'down' ? 'bg-red-500/20' : '';
  const textColor = isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-400';
  const borderColor = isUp ? 'border-green-400/50' : isDown ? 'border-red-400/50' : 'border-gray-700';
  const chartColor = isUp ? '#22c55e' : isDown ? '#ef4444' : '#6b7280';
  const Icon = isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : MinusIcon;
  
  const formattedPrice = regularMarketPrice?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: regularMarketPrice && regularMarketPrice > 10 ? 2 : 4
  }) ?? 'N/A';

  return (
    <div className={`bg-gray-900/50 rounded-lg border ${borderColor} p-4 transition-all duration-300 ease-in-out hover:bg-gray-800/50 hover:shadow-lg hover:shadow-black/20 ${flashColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol.replace('-USD', '')}</h3>
          <p className="text-xs text-gray-500 uppercase">{type}</p>
        </div>
         <div className="h-12 w-24 -mr-4 -mt-2">
            <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={priceSeries} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                    <Line type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} dot={false} isAnimationActive={false}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-mono tabular-nums text-white">${formattedPrice}</p>
        </div>
        <div className={`flex items-center text-sm font-semibold font-mono tabular-nums ${textColor}`}>
          <Icon className="w-4 h-4 mr-1" />
          <span>{change.toFixed(2)}</span>
          <span className="ml-2">({changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
