import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';

import {  useNavigate } from 'react-router-dom';
import { getBoxById } from '../../services/box';
import { deleteBox } from '../../services/box';
import type{Box} from "../../services/box";
import type{BoxItem} from "../../services/box";
import { fetchCurrentUser } from '../../services/api';
import Button from '../../components/common/Button';
import { purchaseBox } from '../../services/box';
import Modal from '../../components/common/Modal';
// import Alert from '../../common/Alert';
import './boxdetail.css';

const BoxDetail: React.FC = () => {
    const { boxId } = useParams<{ boxId: string }>();
    const [box, setBox] = useState<Box | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseResult, setPurchaseResult] = useState<{
        item?: BoxItem;
        remaining?: number;
        message?: string;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取盲盒详情
                const boxData = await getBoxById(boxId!);
                setBox(boxData);

                // 获取当前用户ID
                const user = await fetchCurrentUser();
                setCurrentUserId(user.id);
            } catch (err) {
                console.error('获取数据失败:', err);
                setError('获取盲盒详情失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [boxId]);

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

    const handlePurchase = async () => {
        setShowPurchaseModal(true);
    };
    const confirmPurchase = async () => {
        try {
            if (!boxId) return;

            const result = await purchaseBox(boxId);

            if (result.success) {
                setPurchaseResult({
                    item: result.item,
                    remaining: result.remaining,
                    message: result.message
                });

                // 更新盲盒数量显示
                if (box) {
                    setBox({
                        ...box,
                        boxNum: result.remaining
                    });
                }

                // 如果盲盒已空，跳转回首页
                if (result.remaining === 0) {
                    setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                }
            }
        } catch (error: any) {
            if (error.response) {
                const { data } = error.response;
                if (data.error === '余额不足') {
                    alert('购买失败: 余额不足，请充值');
                    console.log(data.error);
                    navigate('/dashboard');
                } else if (data.error === '该盲盒已无可用物品' || data.error === 'Box not found') {
                    alert('购买失败: 盲盒已售罄');
                    navigate('/home');
                } else {
                    alert(`购买失败: ${data.error || '未知错误'}`);
                }
            } else {
                alert('购买失败: 网络错误');
            }
        } finally {
            setShowPurchaseModal(false);
        }
    };

    if (loading) {
        return <div className="boxdetail-loading">加载中...</div>;
    }

    if (error) {
        return <div className="boxdetail-error">{error}</div>;
    }

    if (!box) {
        return <div className="boxdetail-not-found">盲盒不存在</div>;
    }

    return (
        <div className="boxdetail-container">
            <div className="boxdetail-header">
                <h1 className="boxdetail-title">{box.boxName}</h1>
                <div className="boxdetail-actions">
                    {currentUserId === box.userId ? (
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

            <div className="boxdetail-content">
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

                    {box.description && (
                        <div className="boxdetail-description">
                            <h3>盲盒描述</h3>
                            <p>{box.description}</p>
                        </div>
                    )}

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
            {showPurchaseModal && (
                <Modal
                    title="确认购买"
                    onClose={() => setShowPurchaseModal(false)}
                >
                    <div className="purchase-modal-content">
                        <p>确定要购买这个盲盒吗？</p>
                        <p>价格: ¥{box?.price}</p>
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