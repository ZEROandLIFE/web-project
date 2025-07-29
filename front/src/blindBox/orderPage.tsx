// pages/OrderPage.tsx
import React, { useState, useEffect } from 'react';
import { getMyOrders, getOrdersAsSeller, getOrdersAsBuyer } from '../services/order';
import type { Order } from '../services/order.ts';

import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import './OrderPage.css';
import { fetchCurrentUser } from "../services/api.ts";

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<'all' | 'seller' | 'buyer'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            const user = await fetchCurrentUser();
            setCurrentUser(user);

            setLoading(true);
            setError('');
            try {
                let response;
                if (viewMode === 'seller') {
                    response = await getOrdersAsSeller();
                } else if (viewMode === 'buyer') {
                    response = await getOrdersAsBuyer();
                } else {
                    response = await getMyOrders();
                }

                // 排序
                const sortedOrders = [...response.orders].sort((a, b) => {
                    if (sortBy === 'date') {
                        return sortOrder === 'desc'
                            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    } else {
                        return sortOrder === 'desc'
                            ? b.price - a.price
                            : a.price - b.price;
                    }
                });

                setOrders(sortedOrders);
                setTotalPages(Math.ceil(sortedOrders.length / itemsPerPage));
                setCurrentPage(1); // 重置到第一页
            } catch (err) {
                setError(err instanceof Error ? err.message : '获取订单失败');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [viewMode, sortBy, sortOrder]);

    const handleViewModeChange = (mode: 'all' | 'seller' | 'buyer') => {
        setViewMode(mode);
    };

    const handleSortChange = (type: 'date' | 'price') => {
        if (sortBy === type) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(type);
            setSortOrder('desc');
        }
    };

    // 获取当前页的订单
    const getCurrentOrders = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return orders.slice(startIndex, endIndex);
    };

    return (
        <div className="order-container">
            <h1 className="order-title">我的订单</h1>

            {error && <Alert type="error" message={error} />}

            <div className="order-controls">
                <div className="view-mode">
                    <Button
                        variant={viewMode === 'all' ? 'primary' : 'secondary'}
                        onClick={() => handleViewModeChange('all')}
                    >
                        全部订单
                    </Button>
                    <Button
                        variant={viewMode === 'seller' ? 'primary' : 'secondary'}
                        onClick={() => handleViewModeChange('seller')}
                    >
                        作为卖家
                    </Button>
                    <Button
                        variant={viewMode === 'buyer' ? 'primary' : 'secondary'}
                        onClick={() => handleViewModeChange('buyer')}
                    >
                        作为买家
                    </Button>
                </div>

                <div className="sort-options">
                    <span>排序方式：</span>
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
            </div>

            {loading ? (
                <div className="loading">加载中...</div>
            ) : (
                <div className="order-list">
                    {orders.length === 0 ? (
                        <div className="no-orders">暂无订单</div>
                    ) : (
                        <>
                            <table className="order-table">
                                <thead>
                                <tr>
                                    <th>订单ID</th>
                                    <th>盲盒名称</th>
                                    <th>获得物品</th>
                                    <th>金额</th>
                                    <th>交易类型</th>
                                    <th>交易时间</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getCurrentOrders().map(order => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId}</td>
                                        <td>{order.boxName}</td>
                                        <td>{order.itemName}</td>
                                        <td>¥{order.price}</td>
                                        <td>
                                            {viewMode === 'all' && currentUser ? (
                                                order.sellerId === currentUser.id ? '卖出' : '买入'
                                            ) : viewMode === 'seller' ? '卖出' : '买入'}
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {totalPages > 1 && (
                                <div className="pagination-controls">
                                    <Button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        上一页
                                    </Button>
                                    <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
                                    <Button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        下一页
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderPage;