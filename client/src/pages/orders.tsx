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
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Open
        </Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Closed
        </Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>;
      case 'partially_filled':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Partial
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSideIcon = (side: string) => {
    return side.toLowerCase() === 'buy' ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  const getSideColor = (side: string) => {
    return side.toLowerCase() === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number, symbol: string = '₹') => {
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const orders = data?.orders?.orders || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <ShoppingCart className="mr-3 w-8 h-8 text-blue-600" />
                Orders
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Track your trading orders and their status
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="mt-4 sm:mt-0"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              <strong>Error loading orders:</strong>
              <br />
              {error instanceof Error ? error.message : 'Failed to fetch orders'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading orders...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {data && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {orders.length}
                      </p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-slate-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Open Orders</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(order => order.status === 'open').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Buy Orders</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(order => order.side === 'buy').length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sell Orders</p>
                      <p className="text-2xl font-bold text-red-600">
                        {orders.filter(order => order.side === 'sell').length}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No orders found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    You don't have any orders yet. Start trading to see your orders here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: Order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        {/* Order Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-3 mb-2">
                            {getSideIcon(order.side)}
                            <span className={`font-semibold ${getSideColor(order.side)} capitalize`}>
                              {order.side}
                            </span>
                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                              {order.market}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {order.order_type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            ID: {order.id.slice(0, 8)}...
                          </p>
                        </div>

                        {/* Quantities */}
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Quantity</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {order.total_quantity}
                          </p>
                          {order.remaining_quantity !== order.total_quantity && (
                            <p className="text-xs text-orange-600">
                              {order.remaining_quantity} remaining
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Price</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
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
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Dates */}
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
                          <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
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
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {order.fee > 0 && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Fee: </span>
                                <span className="font-semibold">{order.fee}%</span>
                              </div>
                            )}
                            {order.market_order_locked > 0 && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Locked: </span>
                                <span className="font-semibold">
                                  {formatCurrency(order.market_order_locked)}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Source: </span>
                              <span className="font-semibold capitalize">
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