const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const axios = require('axios');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    let interval;

    socket.on('subscribeMarket', ({ stocks = [], crypto = [] }) => {
      if (interval) clearInterval(interval);

      interval = setInterval(async () => {
        try {
          const stockSymbols = stocks.map(s => s.toUpperCase());
          const cryptoPairs = crypto.map(c => c.toUpperCase());

          const stockPromises = stockSymbols.map(symbol =>
            axios.get(`${FINNHUB_BASE}/quote`, { params: { symbol, token: FINNHUB_API_KEY } })
              .then(r => ({ symbol, regularMarketPrice: r.data.c }))
              .catch(() => ({ symbol, regularMarketPrice: null }))
          );

          const cryptoPromises = cryptoPairs.map(pair =>
            axios.get(`${FINNHUB_BASE}/crypto/candle`, {
              params: {
                symbol: `BINANCE:${pair.replace('-', '')}`, // BTC-USD => BTCUSD
                resolution: 1,
                from: Math.floor(Date.now() / 1000) - 60 * 60,
                to: Math.floor(Date.now() / 1000),
                token: FINNHUB_API_KEY,
              },
            })
            .then(r => ({
              symbol: pair,
              regularMarketPrice: r.data.c ? r.data.c[r.data.c.length - 1] : null,
            }))
            .catch(() => ({ symbol: pair, regularMarketPrice: null }))
          );

          const [stockResults, cryptoResults] = await Promise.all([
            Promise.all(stockPromises),
            Promise.all(cryptoPromises)
          ]);

          socket.emit('marketData', { stocks: stockResults, cryptos: cryptoResults });
        } catch (err) {
          console.error(err);
          socket.emit('marketError', { error: 'Failed to fetch market data' });
        }
      }, 5000); // her 5 saniyede bir güncelle
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (interval) clearInterval(interval);
    });
  });
};
