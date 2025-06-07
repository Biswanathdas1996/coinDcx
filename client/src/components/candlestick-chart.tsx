import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Volume } from 'lucide-react';
import type { CandleData } from '@/types/crypto';

interface CandlestickChartProps {
  data: CandleData[];
  pair: string;
}

export default function CandlestickChart({ data, pair }: CandlestickChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Sort data by time (oldest first for proper chart display)
    const sortedData = [...data].sort((a, b) => a.time - b.time);
    
    // Calculate price range for scaling
    const allPrices = sortedData.flatMap(candle => [candle.high, candle.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% padding
    const chartMin = minPrice - padding;
    const chartMax = maxPrice + padding;
    const chartRange = chartMax - chartMin;

    // Calculate volume range for scaling
    const maxVolume = Math.max(...sortedData.map(c => c.volume));

    return {
      candles: sortedData,
      minPrice: chartMin,
      maxPrice: chartMax,
      priceRange: chartRange,
      maxVolume,
      latestPrice: sortedData[sortedData.length - 1]?.close || 0,
      priceChange: sortedData.length > 1 
        ? sortedData[sortedData.length - 1].close - sortedData[0].open
        : 0
    };
  }, [data]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (!chartData) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No candlestick data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { candles, minPrice, maxPrice, priceRange, maxVolume, latestPrice, priceChange } = chartData;
  const chartHeight = 300;
  const volumeHeight = 80;
  const candleWidth = Math.max(8, Math.min(16, (800 - 60) / candles.length - 2));

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <TrendingUp className="text-blue-400 mr-2 w-5 h-5" />
            Candlestick Chart - {pair}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Latest Price</div>
              <div className="text-lg font-bold text-blue-400">
                {formatPrice(latestPrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Change</div>
              <div className={`text-lg font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="relative">
          {/* Price Chart */}
          <div className="relative bg-slate-900/50 rounded-lg p-4 mb-4" style={{ height: chartHeight }}>
            <svg
              width="100%"
              height={chartHeight - 32}
              viewBox={`0 0 ${candles.length * (candleWidth + 2)} ${chartHeight - 32}`}
              className="overflow-visible"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = (chartHeight - 32) * ratio;
                const price = maxPrice - (priceRange * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={0}
                      y1={y}
                      x2={candles.length * (candleWidth + 2)}
                      y2={y}
                      stroke="#374151"
                      strokeWidth={0.5}
                      strokeDasharray="2,2"
                    />
                    <text
                      x={-5}
                      y={y + 4}
                      fill="#9CA3AF"
                      fontSize="10"
                      textAnchor="end"
                    >
                      {formatPrice(price)}
                    </text>
                  </g>
                );
              })}

              {/* Candlesticks */}
              {candles.map((candle, index) => {
                const x = index * (candleWidth + 2) + (candleWidth + 2) / 2;
                
                // Calculate positions
                const highY = ((maxPrice - candle.high) / priceRange) * (chartHeight - 32);
                const lowY = ((maxPrice - candle.low) / priceRange) * (chartHeight - 32);
                const openY = ((maxPrice - candle.open) / priceRange) * (chartHeight - 32);
                const closeY = ((maxPrice - candle.close) / priceRange) * (chartHeight - 32);
                
                const isGreen = candle.close >= candle.open;
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.abs(closeY - openY);
                
                return (
                  <g key={index}>
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={isGreen ? '#10B981' : '#EF4444'}
                      strokeWidth={1}
                    />
                    
                    {/* Body */}
                    <rect
                      x={x - candleWidth / 2}
                      y={bodyTop}
                      width={candleWidth}
                      height={Math.max(bodyHeight, 1)}
                      fill={isGreen ? '#10B981' : '#EF4444'}
                      stroke={isGreen ? '#10B981' : '#EF4444'}
                      strokeWidth={1}
                      opacity={isGreen ? 0.8 : 1}
                    />
                    
                    {/* Hover area */}
                    <rect
                      x={x - candleWidth / 2}
                      y={0}
                      width={candleWidth}
                      height={chartHeight - 32}
                      fill="transparent"
                      className="hover:fill-slate-700/20 transition-colors"
                    >
                      <title>
                        {formatTime(candle.time)}
                        {'\n'}Open: {formatPrice(candle.open)}
                        {'\n'}High: {formatPrice(candle.high)}
                        {'\n'}Low: {formatPrice(candle.low)}
                        {'\n'}Close: {formatPrice(candle.close)}
                        {'\n'}Volume: {candle.volume.toLocaleString()}
                      </title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Volume Chart */}
          <div className="relative bg-slate-900/30 rounded-lg p-4" style={{ height: volumeHeight }}>
            <div className="flex items-center mb-2">
              <Volume className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-400">Volume</span>
            </div>
            <svg
              width="100%"
              height={volumeHeight - 32}
              viewBox={`0 0 ${candles.length * (candleWidth + 2)} ${volumeHeight - 32}`}
              className="overflow-visible"
            >
              {/* Volume bars */}
              {candles.map((candle, index) => {
                const x = index * (candleWidth + 2) + (candleWidth + 2) / 2;
                const barHeight = maxVolume > 0 ? (candle.volume / maxVolume) * (volumeHeight - 32) : 0;
                const barY = (volumeHeight - 32) - barHeight;
                const isGreen = candle.close >= candle.open;
                
                return (
                  <rect
                    key={index}
                    x={x - candleWidth / 2}
                    y={barY}
                    width={candleWidth}
                    height={barHeight}
                    fill={isGreen ? '#10B981' : '#EF4444'}
                    opacity={0.6}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <title>
                      {formatTime(candle.time)}
                      {'\n'}Volume: {candle.volume.toLocaleString()}
                    </title>
                  </rect>
                );
              })}
            </svg>
          </div>

          {/* Time labels */}
          <div className="flex justify-between mt-2 px-4">
            {candles.length > 0 && (
              <>
                <span className="text-xs text-slate-400">
                  {formatTime(candles[0].time)}
                </span>
                <span className="text-xs text-slate-400">
                  {formatTime(candles[candles.length - 1].time)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-xs text-slate-400">Bullish</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-xs text-slate-400">Bearish</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-slate-500"></div>
            <span className="text-xs text-slate-400">Wick</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}