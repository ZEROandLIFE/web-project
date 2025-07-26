import React, { useState, useEffect } from 'react';
import { getAdminAllOrders, getOrderStats } from '../services/order';
import type { Order, OrderStats } from '../services/order';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import './AdminOrderPage.css';

const AdminOrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'price' | 'orderId'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
    const [activeTab, setActiveTab] = useState<'orders' | 'stats'>('orders');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // 获取订单数据
                const ordersResponse = await getAdminAllOrders({
                    sortBy,
                    sortOrder,
                    page: 1,
                    pageSize: 100
                });
                setOrders(ordersResponse.orders);

                // 获取统计数据
                const statsResponse = await getOrderStats(period);
                setStats(statsResponse);
            } catch (err) {
                setError(err instanceof Error ? err.message : '获取数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sortBy, sortOrder, period]);

    const handleSortChange = (type: 'date' | 'price' | 'orderId') => {
        if (sortBy === type) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(type);
            setSortOrder('desc');
        }
    };

    const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month') => {
        setPeriod(newPeriod);
    };

    const renderStatsCard = (title: string, value: string | number) => (
        <div className="stats-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );

    const renderTrendItem = (trend: { date: string; count: number; revenue: number }) => (
        <div className="trend-item" key={trend.date}>
            <span className="trend-date">{trend.date}</span>
            <span className="trend-count">订单: {trend.count}</span>
            <span className="trend-revenue">收入: ¥{trend.revenue}</span>
        </div>
    );

    const renderTopUser = (user: { userId: number; username: string; orderCount: number; total: number }, type: 'seller' | 'buyer') => (
        <div className="top-user" key={user.userId}>
            <span className="user-rank">#{type === 'seller' ? '卖家' : '买家'} {user.userId}</span>
            <span className="user-name">{user.username}</span>
            <span className="user-orders">订单数: {user.orderCount}</span>
            <span className="user-total">
                {type === 'seller' ? '收入' : '消费'}: ¥{user.total}
            </span>
        </div>
    );

    return (
        <div className="admin-order-container">
            <h1 className="admin-order-title">订单管理系统</h1>

            {error && <Alert type="error" message={error} />}

            {/* 选项卡切换 */}
            <div className="admin-tabs">
                <Button
                    variant={activeTab === 'orders' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('orders')}
                >
                    订单列表
                </Button>
                <Button
                    variant={activeTab === 'stats' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('stats')}
                >
                    统计数据
                </Button>
            </div>

            {/* 控制面板 */}
            <div className="admin-order-controls">
                <div className="period-controls">
                    <span>统计周期：</span>
                    <Button
                        variant={period === 'day' ? 'primary' : 'secondary'}
                        onClick={() => handlePeriodChange('day')}
                    >
                        日
                    </Button>
                    <Button
                        variant={period === 'week' ? 'primary' : 'secondary'}
                        onClick={() => handlePeriodChange('week')}
                    >
                        周
                    </Button>
                    <Button
                        variant={period === 'month' ? 'primary' : 'secondary'}
                        onClick={() => handlePeriodChange('month')}
                    >
                        月
                    </Button>
                </div>

                {activeTab === 'orders' && (
                    <div className="sort-options">
                        <span>排序方式：</span>
                        <Button
                            variant="text"
                            onClick={() => handleSortChange('orderId')}
                            className={sortBy === 'orderId' ? 'active' : ''}
                        >
                            订单ID {sortBy === 'orderId' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => handleSortChange('date')}
                            className={sortBy === 'date' ? 'active' : ''}
                        >
                            时间 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => handleSortChange('price')}
                            className={sortBy === 'price' ? 'active' : ''}
                        >
                            金额 {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <>
                    {activeTab === 'orders' ? (
                        <div className="admin-order-list">
                            {orders.length === 0 ? (
                                <div className="no-orders">暂无订单</div>
                            ) : (
                                <table className="admin-order-table">
                                    <thead>
                                    <tr>
                                        <th>订单ID</th>
                                        <th>盲盒名称</th>
                                        <th>物品</th>
                                        <th>卖家ID</th>
                                        <th>买家ID</th>
                                        <th>金额</th>
                                        <th>交易时间</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(order => (
                                        <tr key={order.orderId}>
                                            <td>{order.orderId}</td>
                                            <td>{order.boxName}</td>
                                            <td>{order.itemName}</td>
                                            <td>{order.sellerId}</td>
                                            <td>{order.buyerId}</td>
                                            <td>¥{order.price}</td>
                                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        stats && (
                            <div className="stats-container">
                                {/* 基础统计 */}
                                <div className="stats-section">
                                    {renderStatsCard('总订单数', stats.totalOrders)}
                                    {renderStatsCard('总收入', `¥${stats.totalRevenue}`)}
                                    {renderStatsCard('平均订单金额', `¥${stats.avgOrderValue}`)}
                                </div>

                                {/* 订单趋势 */}
                                <div className="trends-section">
                                    <h3>订单趋势</h3>
                                    <div className="trends-list">
                                        {stats.orderTrends.map(renderTrendItem)}
                                    </div>
                                </div>

                                {/* 顶级卖家 */}
                                <div className="top-section">
                                    <h3>顶级卖家</h3>
                                    <div className="top-list">
                                        {stats.topSellers.map(user =>
                                            renderTopUser({...user, total: user.totalRevenue}, 'seller')
                                        )}
                                    </div>
                                </div>

                                {/* 顶级买家 */}
                                <div className="top-section">
                                    <h3>顶级买家</h3>
                                    <div className="top-list">
                                        {stats.topBuyers.map(user =>
                                            renderTopUser({...user, total: user.totalSpent}, 'buyer')
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default AdminOrderPage;