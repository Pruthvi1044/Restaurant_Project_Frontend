import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';
import {
  ShoppingBag, CalendarDays, TrendingUp, Clock,
  CheckCircle, XCircle, RefreshCw, ChevronDown,
  Users, Utensils
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../Components/Navbar';

const STATUS_COLORS = {
  pending:   { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', label: 'Pending' },
  preparing: { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', label: 'Preparing' },
  ready:     { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', label: 'Ready' },
  delivered: { bg: 'rgba(34,197,94,0.08)',   color: '#22c55e', label: 'Delivered' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',    color: '#f87171', label: 'Cancelled' },
  approved:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', label: 'Approved' },
  rejected:  { bg: 'rgba(239,68,68,0.1)',    color: '#f87171', label: 'Rejected' },
};

const STATUS_BADGE = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: 'rgba(255,255,255,0.08)', color: '#aaa', label: status };
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const ORDER_STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
const BOOKING_STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchAll = useCallback(async () => {
    try {
      const [ordersRes, bookingsRes, statsRes] = await Promise.all([
        axiosInstance.get('orders/admin/all/'),
        axiosInstance.get('booking/admin/all/'),
        axiosInstance.get('orders/admin-dashboard/'),
      ]);
      setOrders(ordersRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
      setLastRefreshed(new Date());
      setAccessDenied(false);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axiosInstance.patch(`/orders/update-status/${orderId}/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update order status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await axiosInstance.patch(`/booking/update-status/${bookingId}/`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error('Failed to update booking status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
        <Navbar />
        <div className="admin-denied">
          <XCircle size={60} color="#f87171" />
          <h2>Access Denied</h2>
          <p>You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Last refreshed: {lastRefreshed.toLocaleTimeString()} &nbsp;·&nbsp;
              Auto-refreshes every 30s
            </p>
          </div>
          <button className="admin-refresh-btn" onClick={fetchAll}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <ShoppingBag size={28} className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card warn">
            <Clock size={28} className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <CalendarDays size={28} className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card warn">
            <Users size={28} className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{pendingBookings}</div>
              <div className="stat-label">Pending Bookings</div>
            </div>
          </div>
          <div className="stat-card green">
            <TrendingUp size={28} className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">₹{revenue.toFixed(0)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === 'orders' ? ' active' : ''}`}
            onClick={() => setTab('orders')}
          >
            <Utensils size={16} /> Orders
            {pendingOrders > 0 && <span className="tab-badge">{pendingOrders}</span>}
          </button>
          <button
            className={`admin-tab${tab === 'bookings' ? ' active' : ''}`}
            onClick={() => setTab('bookings')}
          >
            <CalendarDays size={16} /> Table Bookings
            {pendingBookings > 0 && <span className="tab-badge">{pendingBookings}</span>}
          </button>
        </div>

        {/* Orders Table */}
        {tab === 'orders' && (
          <div className="admin-table-wrap">
            {loading ? (
              <div className="admin-loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">No orders yet.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-num">{order.order_number}</td>
                      <td className="customer-col">{order.customer_name}</td>
                      <td className="items-col">
                        {order.items?.map((item, i) => (
                          <span key={i} className="item-chip">
                            {item.dish_name} ×{item.quantity}
                          </span>
                        ))}
                      </td>
                      <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td>
                        <span className="payment-chip">
                          {order.payment_method === 'cash' ? '💵 COD' : '💳 Online'}
                        </span>
                      </td>
                      <td><STATUS_BADGE status={order.status} /></td>
                      <td className="date-col">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <div className="select-wrap">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            {ORDER_STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="select-chevron" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Bookings Table */}
        {tab === 'bookings' && (
          <div className="admin-table-wrap">
            {loading ? (
              <div className="admin-loading">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="admin-empty">No table bookings yet.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>{b.name}</td>
                      <td className="email-col">{b.email}</td>
                      <td>{b.phone}</td>
                      <td>{b.booking_date}</td>
                      <td>{b.booking_time?.slice(0,5)}</td>
                      <td>{b.guests}</td>
                      <td><STATUS_BADGE status={b.status} /></td>
                      <td>
                        <div className="booking-actions">
                          {b.status !== 'approved' && (
                            <button
                              className="action-btn approve"
                              disabled={updatingId === b.id}
                              onClick={() => handleUpdateBookingStatus(b.id, 'approved')}
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                          )}
                          {b.status !== 'rejected' && (
                            <button
                              className="action-btn reject"
                              disabled={updatingId === b.id}
                              onClick={() => handleUpdateBookingStatus(b.id, 'rejected')}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
