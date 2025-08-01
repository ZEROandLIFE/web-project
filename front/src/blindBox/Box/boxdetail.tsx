import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoxById, deleteBox, purchaseBox } from '../../services/box';
import type { Box, BoxItem } from '../../services/box';
import { fetchCurrentUser } from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './boxdetail.css';

/**
 * 盲盒详情页面组件
 */
const BoxDetail: React.FC = () => {
    // 路由参数和导航
    const { boxId } = useParams<{ boxId: string }>();
    const navigate = useNavigate();

    // 组件状态
    const [box, setBox] = useState<Box | null>(null); // 当前盲盒数据
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 当前用户ID
    const [loading, setLoading] = useState(true); // 加载状态
    const [error, setError] = useState(''); // 错误信息
    const [currentUserRole, setCurrentUserRole] = useState<'user' | 'admin'>('user'); // 用户角色
    const [showPurchaseModal, setShowPurchaseModal] = useState(false); // 购买确认模态框显示状态

    // 购买结果状态
    const [purchaseResult, setPurchaseResult] = useState<{
        item?: BoxItem;
        remaining?: number;
        message?: string;
    } | null>(null);

    // 动画相关状态
    const [isRolling, setIsRolling] = useState(false); // 是否正在执行开盒动画
    const [rollingItems, setRollingItems] = useState<BoxItem[]>([]); // 动画中滚动的物品列表
    const containerRef = useRef<HTMLDivElement>(null); // 动画容器DOM引用
    const animationRef = useRef<number | null>(null);// 动画帧引用
    const animationDuration = 3000; // 动画持续时间(毫秒)

    /**
     * 初始化数据加载
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 并行获取盲盒数据和当前用户信息
                const [boxData, user] = await Promise.all([
                    getBoxById(boxId!),
                    fetchCurrentUser()
                ]);

                setBox(boxData);
                setCurrentUserId(user.id);
                setCurrentUserRole(user.role);
            } catch (err) {
                console.error('获取数据失败:', err);
                setError('获取盲盒详情失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // 组件卸载时清理动画
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [boxId]);

    /**
     * 处理盲盒下架操作
     */
    const handleTakeDown = async () => {
        if (!boxId) return;

        try {
            await deleteBox(boxId);
            alert('盲盒已成功下架');
            navigate('/home');
        } catch (error) {
            console.error('下架盲盒失败:', error);
            alert('下架盲盒失败，请稍后重试');
        }
    };

    /**
     * 显示购买确认模态框
     */
    const handlePurchase = async () => {
        setShowPurchaseModal(true);
    };

    /**
     * 确认购买盲盒
     */
    const confirmPurchase = async () => {
        if (!boxId || !box) return;

        setShowPurchaseModal(false);

        try {
            const result = await purchaseBox(boxId);

            if (result.success) {
                // 开始开盒动画
                startRollingAnimation(box.items, result.item);

                // 更新盲盒剩余数量
                setBox(prev => prev ? { ...prev, boxNum: result.remaining } : null);

                // 动画结束后显示结果
                setTimeout(() => {
                    setPurchaseResult({
                        item: result.item,
                        remaining: result.remaining,
                        message: result.message
                    });
                    setIsRolling(false);

                    // 更新盲盒数量显示
                    setBox(prev => prev ? { ...prev, boxNum: result.remaining } : null);

                    // 如果盲盒已空，跳转回首页
                    if (result.remaining === 0) {
                        setTimeout(() => navigate('/home'), 2000);
                    }
                }, animationDuration);
            }
        } catch (error: unknown) {
            stopRollingAnimation();

            // 处理不同类型的错误
            if (error instanceof Error && 'response' in error) {
                const { data } = (error as { response?: { data?: { error?: string } } }).response || {};

                if (data?.error === '余额不足') {
                    alert('购买失败: 余额不足，请充值');
                    navigate('/dashboard');
                } else if (data?.error === '该盲盒已无可用物品' || data?.error === 'Box not found') {
                    alert('购买失败: 盲盒已售罄');
                    navigate('/home');
                } else {
                    alert(`购买失败: ${data?.error || '未知错误'}`);
                }
            } else {
                alert('购买失败: 网络错误');
            }
        }
    };

    /**
     * 开始滚动动画
     * @param items 盲盒包含的所有物品
     * @param target 抽中的目标物品
     */
    const startRollingAnimation = (items: BoxItem[], target: BoxItem) => {
        setIsRolling(true);

        // 创建重复物品列表以实现无限滚动效果
        const repeatedItems = [...items, ...items, ...items, ...items, ...items];
        setRollingItems(repeatedItems);

        // 等待状态更新和DOM渲染完成
        requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;

            // 重置滚动位置
            container.scrollLeft = 0;

            let startTime: number | null = null;
            const itemWidth = 120; // 每个物品的宽度(与CSS中一致)

            // 找到目标物品的位置
            const targetIndex = repeatedItems.findIndex(item =>
                item.name === target.name && item.quantity === target.quantity
            );
            const targetScroll = (targetIndex - 2) * itemWidth; // 停在中间偏左2个位置

            /**
             * 动画帧处理函数
             * @param timestamp 时间戳
             */
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // 应用缓动效果
                const easeProgress = easeOutQuad(progress);

                // 计算当前滚动位置(添加额外滚动量增强效果)
                container.scrollLeft = easeProgress * (targetScroll + 1500);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    // 动画结束，精确滚动到目标位置
                    container.scrollLeft = targetScroll;
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        });
    };

    /**
     * 缓动函数 - 减速效果
     * @param t 进度(0-1)
     * @returns 缓动后的进度值
     */
    const easeOutQuad = (t: number) => {
        return t * (2 - t);
    };

    /**
     * 停止动画
     */
    const stopRollingAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsRolling(false);
    };

    // 渲染加载状态
    if (loading) {
        return <div className="boxdetail-loading">加载中...</div>;
    }

    // 渲染错误状态
    if (error) {
        return <div className="boxdetail-error">{error}</div>;
    }

    // 渲染盲盒不存在状态
    if (!box) {
        return <div className="boxdetail-not-found">盲盒不存在</div>;
    }

    return (
        <div className="boxdetail-container">
            {/* 盲盒头部信息 */}
            <div className="boxdetail-header">
                <h1 className="boxdetail-title">{box.boxName}</h1>
                <div className="boxdetail-actions">
                    {currentUserId === box.userId || currentUserRole === 'admin' ? (
                        <Button variant="secondary" onClick={handleTakeDown}>
                            下架盲盒
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handlePurchase}>
                            购买盲盒
                        </Button>
                    )}
                </div>
            </div>

            {/* 盲盒内容 */}
            <div className="boxdetail-content">
                {/* 盲盒图片 */}
                <div className="boxdetail-image-section">
                    {box.boxAvatar ? (
                        <img
                            src={box.boxAvatar}
                            alt={box.boxName}
                            className="boxdetail-image"
                        />
                    ) : (
                        <div className="boxdetail-no-image">暂无图片</div>
                    )}
                </div>

                {/* 盲盒信息 */}
                <div className="boxdetail-info-section">
                    <div className="boxdetail-meta">
                        <div className="boxdetail-meta-item">
                            <span className="boxdetail-meta-label">数量:</span>
                            <span className="boxdetail-meta-value">{box.boxNum}</span>
                        </div>
                        <div className="boxdetail-meta-item">
                            <span className="boxdetail-meta-label">价格:</span>
                            <span className="boxdetail-meta-value">¥{box.price}</span>
                        </div>
                    </div>

                    {/* 盲盒描述 */}
                    {box.description && (
                        <div className="boxdetail-description">
                            <h3>盲盒描述</h3>
                            <p>{box.description}</p>
                        </div>
                    )}

                    {/* 包含物品列表 */}
                    <div className="boxdetail-items">
                        <h3>包含物品</h3>
                        <ul className="boxdetail-items-list">
                            {box.items.map((item, index) => (
                                <li key={index} className="boxdetail-item">
                                    <span className="boxdetail-item-name">{item.name}</span>
                                    <span className="boxdetail-item-quantity">x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 购买确认模态框 */}
            {showPurchaseModal && (
                <Modal
                    title="确认购买"
                    onClose={() => setShowPurchaseModal(false)}
                >
                    <div className="purchase-modal-content">
                        <p>确定要购买这个盲盒吗？</p>
                        <p>价格: ¥{box.price}</p>
                        <div className="purchase-modal-actions">
                            <Button
                                onClick={() => setShowPurchaseModal(false)}
                                variant="secondary"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={confirmPurchase}
                                variant="primary"
                            >
                                确认购买
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* 开盒动画 */}
            {isRolling && (
                <div className="rolling-overlay">
                    <div className="rolling-container">
                        <h3 className="rolling-title">开盒中...</h3>
                        <div className="items-container" ref={containerRef}>
                            <div className="items-track">
                                {rollingItems.map((item, index) => (
                                    <div key={`${item.name}-${index}`} className="rolling-item">
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="center-indicator"></div>
                    </div>
                </div>
            )}

            {/* 购买结果展示 */}
            {purchaseResult && (
                <div className="purchase-result">
                    <h3>{purchaseResult.message}</h3>
                    {purchaseResult.item && (
                        <div className="purchase-item">
                            <p>获得物品: {purchaseResult.item.name} *1</p>
                            <p>盲盒剩余数量: {purchaseResult.remaining}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BoxDetail;