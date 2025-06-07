export interface CryptoAnalysisResponse {
  analysis: {
    candles_analysis: string;
    order_book_analysis: string;
    trade_history_analysis: string;
  };
  pair: string;
  recipes: {
    buy_or_sell: string;
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
