import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Package, Calendar, Clock, MapPin, ChevronRight, ShoppingBag, Utensils } from 'lucide-react';
import '../styles/MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersRes, bookingsRes] = await Promise.all([
                axiosInstance.get('orders/my-orders/'),
                axiosInstance.get('booking/my-bookings/')
            ]);
            setOrders(ordersRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'status-pending',
            'preparing': 'status-preparing',
            'ready': 'status-ready',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled',
            'approved': 'status-delivered', // reusing class for table booking
            'rejected': 'status-cancelled'
        };
        return colors[status.toLowerCase()] || 'status-default';
    };

    return (
        <div className="orders-page">
            <Navbar />
            <div className="orders-container">
                <div className="orders-header">
                    <h1>Activity History</h1>
                    <div className="tab-container">
                        <button 
                            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingBag size={20} /> Food Orders
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <Utensils size={20} /> Table Bookings
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading your history...</div>
                ) : (
                    <div className="history-content">
                        {activeTab === 'orders' ? (
                            <div className="orders-list">
                                {orders.length > 0 ? orders.map(order => (
                                    <div key={order.id} className="history-card order-card">
                                        <div className="card-info">
                                            <div className="card-top">
                                                <span className="id-tag">#{order.order_number}</span>
                                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <div className="items-summary">
                                                    {order.items?.map(item => (
                                                        <span key={item.id}>{item.quantity}x {item.dish_name}</span>
                                                    )).reduce((prev, curr) => [prev, ', ', curr])}
                                                </div>
                                                <div className="order-meta">
                                                    <span><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span><MapPin size={14} /> {order.shipping_address || 'Standard Delivery'}</span>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <span className="total-price">₹{order.total_amount}</span>
                                                <button className="view-details">Track Order <ChevronRight size={16}/></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="empty-state">No orders found. Time to eat?</div>}
                            </div>
                        ) : (
                            <div className="bookings-list">
                                {bookings.length > 0 ? bookings.map(booking => (
                                    <div key={booking.id} className="history-card booking-card">
                                        <div className="card-info">
                                            <div className="card-top">
                                                <span className="id-tag">Table for {booking.guests}</span>
                                                <span className={`status-badge ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <div className="booking-details">
                                                    <div className="meta-item">
                                                        <Calendar size={18} />
                                                        <span>{booking.booking_date}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <Clock size={18} />
                                                        <span>{booking.booking_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <span className="customer-name">{booking.name}</span>
                                                <button className="view-details">View Details <ChevronRight size={16}/></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="empty-state">No table bookings found.</div>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyOrders;
