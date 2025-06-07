import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, Shield, Percent, Tag, Lightbulb, BarChart3, Layers, History, TriangleAlert, Search, Coins } from 'lucide-react';
import type { CryptoAnalysisResponse, CryptoAnalysisRequest } from '@/types/crypto';

export default function CryptoDashboard() {
  const [pair, setPair] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CryptoAnalysisResponse | null>(null);

  const getRiskLevelColor = (riskLevel: string) => {
    const level = riskLevel.toLowerCase();
    if (level.includes('low')) return 'text-green-400';
    if (level.includes('medium') || level.includes('moderate')) return 'text-yellow-400';
    if (level.includes('high') || level.includes('extreme')) return 'text-red-400';
    return 'text-slate-400';
  };

  const getBuySellColor = (signal: string) => {
    const sig = signal.toLowerCase();
    if (sig.includes('buy')) return 'text-green-400';
    if (sig.includes('sell')) return 'text-red-400';
    return 'text-slate-400';
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '₹0.00';
    return `₹${price.toFixed(2)}`;
  };

  const formatProfit = (profit: number) => {
    if (profit === 0) return '0.0%';
    return `${profit > 0 ? '+' : ''}${profit.toFixed(2)}%`;
  };

  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleAnalyze = async () => {
    if (!pair.trim()) {
      setError('Please enter a crypto trading pair (e.g., I-USDT_INR)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const requestData: CryptoAnalysisRequest = { pair: pair.trim() };
      
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data: CryptoAnalysisResponse = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Analysis error:', err);
      
      let errorMsg = 'Failed to analyze the trading pair. ';
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMsg += 'Please ensure the Flask server is running on localhost:5000.';
        } else {
          errorMsg += err.message;
        }
      } else {
        errorMsg += 'An unknown error occurred.';
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Crypto Analysis Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="cryptoPair" className="block text-sm font-medium text-slate-300 mb-2">
                    <Coins className="inline w-4 h-4 text-blue-400 mr-2" />
                    Crypto Trading Pair
                  </Label>
                  <Input
                    id="cryptoPair"
                    type="text"
                    placeholder="e.g., I-USDT_INR, BTC-USDT_INR"
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="animate-fade-in mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-1">Analyzing Market Data</h3>
                    <p className="text-slate-400">Processing candles, order book, and trade history...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="animate-fade-in mb-6">
            <Alert className="bg-red-900/20 border-red-500/30">
              <TriangleAlert className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong className="text-red-400 font-medium">Analysis Failed</strong>
                <br />
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="animate-fade-in">
            {/* Trading Recipe Highlight */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                <TrendingUp className="text-blue-400 mr-3 w-6 h-6" />
                Trading Recommendation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Buy/Sell Signal */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-medium">Signal</span>
                      <TrendingUp className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className={`text-2xl font-bold ${getBuySellColor(results.recipes.buy_or_sell)}`}>
                      {results.recipes.buy_or_sell}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Level */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-medium">Risk Level</span>
                      <Shield className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className={`text-2xl font-bold ${getRiskLevelColor(results.recipes.risk_level)}`}>
                      {results.recipes.risk_level}
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Profit */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-medium">Expected Profit</span>
                      <Percent className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatProfit(results.recipes.expected_profit)}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Price */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-medium">Suggested Price</span>
                      <Tag className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatPrice(results.recipes.suggested_price_per_unit)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reasoning Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                    <Lightbulb className="text-yellow-400 mr-2 w-5 h-5" />
                    Analysis Reasoning
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {results.recipes.reasoning}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                <BarChart3 className="text-purple-400 mr-3 w-6 h-6" />
                Detailed Analysis
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Candles Analysis */}
                <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-green-900/20 to-transparent">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                      <BarChart3 className="text-green-400 mr-2 w-5 h-5" />
                      Candles Analysis
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {truncateText(results.analysis.candles_analysis)}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Book Analysis */}
                <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-transparent">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                      <Layers className="text-blue-400 mr-2 w-5 h-5" />
                      Order Book Analysis
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {truncateText(results.analysis.order_book_analysis)}
                    </div>
                  </CardContent>
                </Card>

                {/* Trade History Analysis */}
                <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-purple-900/20 to-transparent">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                      <History className="text-purple-400 mr-2 w-5 h-5" />
                      Trade History Analysis
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {truncateText(results.analysis.trade_history_analysis)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
