'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import AdminLayout from '../dashboard/layout';

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
  REFUNDED: 'bg-purple-500/20 text-purple-400',
};

const paymentStatusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PAID: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
  REFUNDED: 'bg-purple-500/20 text-purple-400',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 mt-1">Manage customer orders</p>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Order #</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Items</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Payment</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Date</th>
                    <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-3 px-4">
                        <span className="text-white font-mono text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-white text-sm">{order.customerName || '-'}</p>
                        <p className="text-slate-400 text-xs">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300">{order.items?.length || 0} item(s)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">₹{order.totalAmount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${paymentStatusColors[order.paymentStatus] || 'bg-slate-500/20 text-slate-400'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`px-2 py-1 rounded text-xs border-0 ${statusColors[order.status] || 'bg-slate-500/20 text-slate-400'}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition text-slate-400 hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No orders yet
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Customer</h3>
                  <p className="text-white">{selectedOrder.customerName || 'N/A'}</p>
                  <p className="text-slate-400 text-sm">{selectedOrder.customerEmail}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                        <div>
                          <p className="text-white">{item.productName}</p>
                          <p className="text-slate-400 text-sm">{item.contentType} × {item.quantity}</p>
                        </div>
                        <span className="text-amber-400">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Payment Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${paymentStatusColors[selectedOrder.paymentStatus]}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Payment Method</h3>
                    <p className="text-white">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                {/* Razorpay Info */}
                {selectedOrder.razorpayOrderId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-2">Razorpay Order ID</h3>
                      <p className="text-white font-mono text-sm">{selectedOrder.razorpayOrderId}</p>
                    </div>
                    {selectedOrder.razorpayPaymentId && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-2">Razorpay Payment ID</h3>
                        <p className="text-white font-mono text-sm">{selectedOrder.razorpayPaymentId}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                  <span className="text-lg font-medium text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-amber-400">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
