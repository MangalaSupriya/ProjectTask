document.addEventListener("DOMContentLoaded", function() {
    fetchBitcoinPrice();
    loadTradingViewChart();
    fetchTrendingCoins();
    fetchYouMayLike();
});

function fetchBitcoinPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr&include_24hr_change=true')
    .then(response => response.json())
    .then(data => {
        const priceUSD = data.bitcoin.usd;
        const priceINR = data.bitcoin.inr;
        const change = data.bitcoin.usd_24h_change;

        document.querySelector('.bitcoin-price .price').textContent = `Price: ${priceUSD} USD / ${priceINR} INR`;
        document.querySelector('.bitcoin-price .change').textContent = `Change (24h): ${change.toFixed(2)}%`;
    })
    .catch(error => console.error('Error fetching Bitcoin price:', error));
}

function loadTradingViewChart() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.onload = function() {
        // Customize the widget according to your requirements
        new TradingView.widget({
            "container_id": "tradingview-widget-container",
            "width": 980,
            "height": 610,
            "symbol": "COINBASE:BTCUSD",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "withdateranges": true,
            "range": "ytd",
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "details": true,
            "hotlist": true,
            "calendar": true,
            "studies": [
                "MACD@tv-basicstudies",
                "StochasticRSI@tv-basicstudies",
                "Volume@tv-basicstudies"
            ],
            "show_popup_button": true,
            "popup_width": "1000",
            "popup_height": "650"
        });
    };
    document.body.appendChild(script);
}

function fetchTrendingCoins() {
    fetch('https://api.coingecko.com/api/v3/search/trending')
    .then(response => response.json())
    .then(data => {
        const trendingCoins = data.coins.slice(0, 3);
        const coinList = document.querySelector('.trending-coins .coin-list');

        trendingCoins.forEach(coin => {
            const listItem = document.createElement('li');
            listItem.textContent = `${coin.item.name} (${coin.item.symbol})`;
            coinList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching trending coins:', error));
}

function fetchYouMayLike() {
  
    fetchTrendingCoins()
    .then(() => {
        const trendingCoins = document.querySelectorAll('.trending-coins .coin-list li');
        const carousel = document.querySelector('.you-may-like .carousel');

        trendingCoins.forEach(coin => {
            const clone = coin.cloneNode(true);
            carousel.appendChild(clone);
        });
    })
    .catch(error => console.error('Error fetching "You May Also Like" coins:', error));
}
