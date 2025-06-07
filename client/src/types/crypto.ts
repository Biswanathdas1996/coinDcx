export interface CandleData {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  volume: number;
}

export interface CryptoAnalysisResponse {
  analysis: {
    candles?: CandleData[];
    candles_analysis: string;
    order_book_analysis: string;
    trade_history_analysis: string;
  };
  pair: string;
  recipes: {
    buy_or_not: string;
    expected_profit: number;
    pair_name: string;
    quantity: number;
    reasoning: string;
    risk_level: string;
    suggested_price_per_unit: number;
    time_frame: string;
  };
}

export interface CryptoAnalysisRequest {
  pair: string;
}
