
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { MarketData, PriceHistory } from '../types';
import { config } from '../../../../components/config';

const SOCKET_URL = `${config.api}`;
const MAX_HISTORY_LENGTH = 30;

export function useMarketData(stocks: string[], crypto: string[]) {
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

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('marketData', (data: MarketData) => {
      setPriceHistory(prev => {
        const newHistory = { ...prev };
        [...data.stocks, ...data.cryptos].forEach(item => {
          if (!item.regularMarketPrice) return;
          
          if (!newHistory[item.symbol]) {
            newHistory[item.symbol] = {
                initial: item.regularMarketPrice,
                history: [{ price: item.regularMarketPrice }]
            };
          } else {
             const updatedHistory = [...newHistory[item.symbol].history, { price: item.regularMarketPrice }];
             newHistory[item.symbol].history = updatedHistory.slice(-MAX_HISTORY_LENGTH);
          }
        });
        return newHistory;
      });
      setMarketData(data);
    });

    socketRef.current.on('marketError', (err: any) => {
      console.error('Market Error:', err);
    });

    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once

  return { marketData, priceHistory, isConnected };
}
