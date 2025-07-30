import React, { useState, useEffect } from 'react';
import { getOrdersAsBuyer } from '../services/order';
import './warehouse.css';

// 定义仓库物品接口类型
interface WarehouseItem {
    itemName: string;        // 物品名称
    createdAt: string;       // 获得时间（格式化后的字符串）
    boxName: string;         // 所属盲盒名称
    price: number;           // 购买价格
}

const Warehouse: React.FC = () => {
    // 状态定义
    const [items, setItems] = useState<WarehouseItem[]>([]); // 仓库物品列表
    const [loading, setLoading] = useState(true);           // 加载状态
    const [error, setError] = useState('');                  // 错误信息
    const [currentPage, setCurrentPage] = useState(1);       // 当前页码
    const [totalPages, setTotalPages] = useState(1);         // 总页数
    const itemsPerPage = 16; // 每页显示物品数量（4行×4列布局）

    // 副作用：组件挂载时获取仓库物品数据
    useEffect(() => {
        const fetchWarehouseItems = async () => {
            try {
                setLoading(true);
                // 调用API获取订单数据
                const orders = await getOrdersAsBuyer();

                // 转换订单数据为仓库物品格式
                const warehouseItems = orders.orders.map(order => ({
                    itemName: order.itemName,
                    createdAt: new Date(order.createdAt).toLocaleString(),
                    boxName: order.boxName,
                    price: order.price
                }));

                // 更新状态
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

    /**
     * 获取当前页应该显示的物品列表
     * @returns 当前页的物品数组
     */
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    // 加载状态显示
    if (loading) {
        return <div className="warehouse-loading">加载中...</div>;
    }

    // 错误状态显示
    if (error) {
        return <div className="warehouse-error">{error}</div>;
    }

    return (
        <div className="warehouse-container">
            <h1 className="warehouse-title">我的仓库</h1>

            {/* 空仓库状态 */}
            {items.length === 0 ? (
                <div className="warehouse-empty">仓库空空如也，快去购买盲盒吧！</div>
            ) : (
                <>
                    {/* 仓库物品网格布局 */}
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

                    {/* 分页控件（仅在总页数大于1时显示） */}
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