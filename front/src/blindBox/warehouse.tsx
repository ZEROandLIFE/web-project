import React, { useState, useEffect } from 'react';
import { getOrdersAsBuyer } from '../services/order';
import './warehouse.css';

interface WarehouseItem {
    itemName: string;
    createdAt: string;
    boxName: string;
    price: number;
}

const Warehouse: React.FC = () => {
    const [items, setItems] = useState<WarehouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 16; // 4行×4列

    useEffect(() => {
        const fetchWarehouseItems = async () => {
            try {
                setLoading(true);
                const orders = await getOrdersAsBuyer();

                const warehouseItems = orders.orders.map(order => ({
                    itemName: order.itemName,
                    createdAt: new Date(order.createdAt).toLocaleString(),
                    boxName: order.boxName,
                    price: order.price
                }));

                setItems(warehouseItems);
                setTotalPages(Math.ceil(warehouseItems.length / itemsPerPage));
            } catch (err) {
                console.error('获取仓库物品失败:', err);
                setError('获取仓库物品失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseItems();
    }, []);

    // 获取当前页的物品
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    if (loading) {
        return <div className="warehouse-loading">加载中...</div>;
    }

    if (error) {
        return <div className="warehouse-error">{error}</div>;
    }

    return (
        <div className="warehouse-container">
            <h1 className="warehouse-title">我的仓库</h1>

            {items.length === 0 ? (
                <div className="warehouse-empty">仓库空空如也，快去购买盲盒吧！</div>
            ) : (
                <>
                    <div className="warehouse-items">
                        {getCurrentItems().map((item, index) => (
                            <div key={index} className="warehouse-item">
                                <div className="item-name">{item.itemName}</div>
                                <div className="item-details">
                                    <span>来自盲盒: {item.boxName}</span>
                                    <span>购买价格: ¥{item.price}</span>
                                    <span>获得时间: {item.createdAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                上一页
                            </button>
                            <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                下一页
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Warehouse;