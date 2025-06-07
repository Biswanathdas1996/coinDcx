import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import type { OrdersResponse, Order } from '@/types/orders';

export default function OrdersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', refreshKey],
    queryFn: async (): Promise<OrdersResponse> => {
      const response = await fetch('http://127.0.0.1:5001/orders', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-600/50">
          <Clock className="w-3 h-3 mr-1" />
          Open
        </Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-600/50">
          <CheckCircle className="w-3 h-3 mr-1" />
          Closed
        </Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-900/30 text-red-300 border-red-600/50">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>;
      case 'partially_filled':
        return <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-300 border-yellow-600/50">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Partial
        </Badge>;
      default:
        return <Badge variant="outline" className="border-slate-600 text-slate-300">{status}</Badge>;
    }
  };

  const getSideIcon = (side: string) => {
    return side.toLowerCase() === 'buy' ? (
      <ArrowUpRight className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-400" />
    );
  };

  const getSideColor = (side: string) => {
    return side.toLowerCase() === 'buy' ? 'text-green-400' : 'text-red-400';
  };

  const formatCurrency = (amount: number, symbol: string = '₹') => {
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const orders = data?.orders?.orders || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Orders Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-slate-700 border-slate-600 text-slate-50 hover:bg-slate-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analysis</span>
                </Button>
              </Link>
              <Button 
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-slate-50 hover:bg-slate-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Error Alert */}
        {error && (
          <div className="animate-fade-in mb-6">
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong className="text-red-400 font-medium">Failed to Load Orders</strong>
                <br />
                {error instanceof Error ? error.message : 'Failed to fetch orders'}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <div className="animate-fade-in mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-1">Loading Orders</h3>
                    <p className="text-slate-400">Fetching your trading orders...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders List */}
        {data && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Orders</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {orders.length}
                      </p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-slate-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Open Orders</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {orders.filter(order => order.status === 'open').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Buy Orders</p>
                      <p className="text-2xl font-bold text-green-400">
                        {orders.filter(order => order.side === 'buy').length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Sell Orders</p>
                      <p className="text-2xl font-bold text-red-400">
                        {orders.filter(order => order.side === 'sell').length}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    No orders found
                  </h3>
                  <p className="text-slate-400">
                    You don't have any orders yet. Start trading to see your orders here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: Order) => (
                  <Card key={order.id} className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        {/* Order Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-3 mb-2">
                            {getSideIcon(order.side)}
                            <span className={`font-semibold ${getSideColor(order.side)} capitalize`}>
                              {order.side}
                            </span>
                            <span className="font-mono text-sm bg-slate-700 px-2 py-1 rounded">
                              {order.market}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            {order.order_type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            ID: {order.id.slice(0, 8)}...
                          </p>
                        </div>

                        {/* Quantities */}
                        <div>
                          <p className="text-sm text-slate-400">Quantity</p>
                          <p className="font-semibold text-slate-100">
                            {order.total_quantity}
                          </p>
                          {order.remaining_quantity !== order.total_quantity && (
                            <p className="text-xs text-orange-400">
                              {order.remaining_quantity} remaining
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div>
                          <p className="text-sm text-slate-400">Price</p>
                          <p className="font-semibold text-slate-100">
                            {formatCurrency(order.price_per_unit)}
                          </p>
                          {order.avg_price > 0 && (
                            <p className="text-xs text-slate-500">
                              Avg: {formatCurrency(order.avg_price)}
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Status</p>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Dates */}
                        <div>
                          <p className="text-sm text-slate-400">Created</p>
                          <p className="text-sm font-mono text-slate-100">
                            {formatDate(order.created_at)}
                          </p>
                          {order.updated_at !== order.created_at && (
                            <p className="text-xs text-slate-500">
                              Updated: {formatDate(order.updated_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Additional Details */}
                      {(order.fee > 0 || order.market_order_locked > 0) && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {order.fee > 0 && (
                              <div>
                                <span className="text-slate-400">Fee: </span>
                                <span className="font-semibold text-slate-200">{order.fee}%</span>
                              </div>
                            )}
                            {order.market_order_locked > 0 && (
                              <div>
                                <span className="text-slate-400">Locked: </span>
                                <span className="font-semibold text-slate-200">
                                  {formatCurrency(order.market_order_locked)}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-400">Source: </span>
                              <span className="font-semibold text-slate-200 capitalize">
                                {order.source.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}