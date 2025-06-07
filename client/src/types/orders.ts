export interface Order {
  avg_price: number;
  client_order_id: string | null;
  closed_at: string | null;
  created_at: string;
  ecode: string;
  fee: number;
  fee_amount: number;
  id: string;
  locked_spot_balance: boolean;
  maker_fee: number;
  market: string;
  market_order_locked: number;
  notification: string;
  order_type: string;
  price_per_unit: number;
  remaining_quantity: number;
  side: "buy" | "sell";
  source: string;
  status: "open" | "closed" | "cancelled" | "partially_filled";
  stop_price: number;
  taker_fee: number;
  time_in_force: string;
  total_quantity: number;
  updated_at: string;
  user_id: string;
}

export interface OrdersResponse {
  orders: {
    cp: boolean;
    cp_hash: Record<string, any>;
    details: boolean;
    orders: Order[];
  };
}