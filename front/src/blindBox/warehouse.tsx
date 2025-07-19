import React, { useState, useEffect } from 'react';
import { getOrdersAsBuyer } from '../services/order';
import './warehouse.css'; // 可选的样式文件

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

    useEffect(() => {
        const fetchWarehouseItems = async () => {
            try {

                // 获取作为买家的订单
                const orders = await getOrdersAsBuyer();

                // 提取物品信息
                const warehouseItems = orders.orders.map(order => ({
                    itemName: order.itemName,
                    createdAt: new Date(order.createdAt).toLocaleString(),
                    boxName: order.boxName,
                    price: order.price
                }));

                setItems(warehouseItems);
            } catch (err) {
                console.error('获取仓库物品失败:', err);
                setError('获取仓库物品失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseItems();
    }, []);

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
                <div className="warehouse-items">
                    {items.map((item, index) => (
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
            )}
        </div>
    );
};

export default Warehouse;