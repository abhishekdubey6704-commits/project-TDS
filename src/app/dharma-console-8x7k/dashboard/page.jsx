'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

const RecentOrderRow = ({ order }) => (
  <tr className="border-b border-slate-700/50 hover:bg-slate-800/50">
    <td className="py-3 px-4 text-slate-300">{order.orderNumber}</td>
    <td className="py-3 px-4 text-slate-300">{order.customerName || order.customerEmail}</td>
    <td className="py-3 px-4">
      <span className={`px-2 py-1 rounded-full text-xs ${
        order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
        order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {order.status}
      </span>
    </td>
    <td className="py-3 px-4 text-slate-300">₹{order.totalAmount}</td>
    <td className="py-3 px-4 text-slate-500 text-sm">
      {new Date(order.createdAt).toLocaleDateString()}
    </td>
  </tr>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVolumes: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [volumesRes, productsRes, ordersRes, usersRes] = await Promise.all([
        adminApi.getVolumes(),
        adminApi.getProducts(),
        adminApi.getOrders(),
        adminApi.getUsers(),
      ]);

      const volumes = volumesRes.data.data || [];
      const products = productsRes.data.data || [];
      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];

      // Calculate revenue from completed orders
      const totalRevenue = orders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

      setStats({
        totalVolumes: volumes.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: users.length,
      });

      // Get recent 5 orders
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Volumes"
          value={stats.totalVolumes}
          color="bg-purple-500/20"
          icon={<svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          color="bg-blue-500/20"
          icon={<svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          color="bg-amber-500/20"
          icon={<svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="bg-green-500/20"
          icon={<svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          color="bg-pink-500/20"
          icon={<svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Order #</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <RecentOrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
